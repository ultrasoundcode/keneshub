import 'dotenv/config'; // Load .env file
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { generateToken, authMiddleware } from './auth.js';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ... (other imports)

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port for other providers
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with real email or env var
    pass: process.env.EMAIL_PASS || 'your-app-password',   // Replace with App Password
  },
});

// ... (otpStore setup)

// Отправить код (Email или Телефон)
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { contact, type, name } = req.body; // type: 'email' | 'phone'

    if (!contact || !name) {
      return res.status(400).json({ error: 'Контакт и имя обязательны' });
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save to store (expires in 5 mins)
    otpStore.set(contact, { code, name, expires: Date.now() + 5 * 60 * 1000 });

    console.log(`🔐 OTP code for ${contact}: ${code}`); // Leave for debug

    if (type === 'email') {
      try {
        await transporter.sendMail({
          from: '"KenesHab Support" <noreply@keneshab.kz>',
          to: contact,
          subject: 'Ваш код подтверждения KenesHab',
          text: `Здравствуйте, ${name}!\n\nВаш код для входа: ${code}\n\nКод действителен 5 минут.`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
            <h2>KenesHab</h2>
            <p>Здравствуйте, <strong>${name}</strong>!</p>
            <p>Ваш код для входа в личный кабинет:</p>
            <h1 style="color: #00d4ff; letter-spacing: 5px;">${code}</h1>
            <p>Код действителен 5 минут.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; font-size: 12px;">Если вы не запрашивали код, проигнорируйте это письмо.</p>
          </div>`
        });
        console.log(`📧 Email sent to ${contact}`);
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
        // Error handling: still respond success but maybe warn? 
        // For production, we should probably fail if email fails.
        // For now, let's return error so user knows.
        return res.status(500).json({ error: 'Не удалось отправить письмо. Проверьте правильность email.' });
      }
    } else {
      // SMS logic would go here (requires SMS gateway API)
      console.log(`📱 SMS simulation for ${contact}: ${code}`);
    }

    res.json({ message: 'Код отправлен' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Проверить код и войти
app.post('/api/auth/otp/verify', (req, res) => {
  try {
    const { contact, code } = req.body;

    const record = otpStore.get(contact);
    
    if (!record) {
      return res.status(400).json({ error: 'Код не найден или истек' });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(contact);
      return res.status(400).json({ error: 'Код истек' });
    }

    // Allow fixed code for testing if needed, or strictly record.code
    // For now strict check
    if (record.code !== code) {
      return res.status(400).json({ error: 'Неверный код' });
    }

    // Code is valid - find or create user
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?').get(contact, contact);

    if (!user) {
      // Create new user
      const id = uuidv4();
      const isEmail = contact.includes('@');
      
      db.prepare(
        `INSERT INTO users (id, email, phone, full_name, password_hash) VALUES (?, ?, ?, ?, ?)`
      ).run(
        id, 
        isEmail ? contact : null, 
        isEmail ? null : contact, 
        record.name,
        'otp-user' 
      );
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    // Clear OTP
    otpStore.delete(contact);

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получить текущего пользователя
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, phone, iin, plan, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(user);
});

// Обновление профиля
app.put('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const { full_name, phone, iin } = req.body;
    db.prepare('UPDATE users SET full_name = ?, phone = ?, iin = ? WHERE id = ?')
      .run(full_name, phone || null, iin || null, req.user.id);
    
    const user = db.prepare('SELECT id, email, full_name, phone, iin, plan, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// ===================== ADMIN ROUTES =====================

const ADMIN_EMAIL = '0xexperimentalforeverything@gmail.com'; // Hardcoded admin for now

function adminMiddleware(req, res, next) {
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }
  next();
}

// Получить ВСЕ заявления (Admin)
app.get('/api/admin/applications', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const applications = db.prepare(`
      SELECT a.*, u.full_name as user_name, u.email as user_email 
      FROM applications a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC
    `).all();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Ответить на заявление (Admin)
app.post('/api/admin/reply', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { applicationId, message, status } = req.body;
    
    // 1. Get application and user details
    const appData = db.prepare(`
      SELECT a.*, u.email as user_email, u.full_name as user_name
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `).get(applicationId);

    if (!appData) return res.status(404).json({ error: 'Заявление не найдено' });

    // 2. Update status if provided
    if (status) {
      db.prepare('UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(status, applicationId);
    }

    // 3. Send Email
    if (appData.user_email) {
      await transporter.sendMail({
        from: '"KenesHab Support" <noreply@keneshab.kz>',
        to: appData.user_email,
        subject: `Обновление по вашему заявлению в ${appData.creditor_name}`,
        html: `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Здравствуйте, ${appData.user_name}!</h2>
          <p>По вашему заявлению (ID: ${applicationId.slice(0, 8)}...) есть новости.</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #00d4ff; margin: 20px 0;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p>Текущий статус: <strong>${status || appData.status}</strong></p>
          <hr />
          <p style="color: #888; font-size: 12px;">С уважением, команда KenesHab.</p>
        </div>`
      });
    }

    res.json({ message: 'Ответ отправлен и статус обновлен' });
  } catch (err) {
    console.error('Admin reply error:', err);
    res.status(500).json({ error: 'Ошибка при отправке ответа', details: err.message });
  }
});


// ===================== USER APPLICATIONS ROUTES =====================

// Получить все заявления пользователя
app.get('/api/applications', authMiddleware, (req, res) => {
  const applications = db.prepare(
    'SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json(applications);
});

// Получить одно заявление
app.get('/api/applications/:id', authMiddleware, (req, res) => {
  const app_ = db.prepare(
    'SELECT * FROM applications WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);
  
  if (!app_) return res.status(404).json({ error: 'Заявление не найдено' });
  res.json(app_);
});

// Создать заявление
app.post('/api/applications', authMiddleware, (req, res) => {
  try {
    const {
      creditor_type, creditor_name, request_type,
      contract_number, debt_amount, monthly_income,
      dependents, description
    } = req.body;

    if (!creditor_type || !creditor_name || !request_type) {
      return res.status(400).json({ error: 'Тип кредитора, название и тип обращения обязательны' });
    }

    const id = uuidv4();

    // Генерация текста заявления (упрощённая версия ИИ)
    const generated_text = generateApplicationText({
      creditor_name, request_type, contract_number,
      debt_amount, monthly_income, dependents, description
    });

    db.prepare(`
      INSERT INTO applications (id, user_id, creditor_type, creditor_name, request_type,
        contract_number, debt_amount, monthly_income, dependents, description, generated_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.user.id, creditor_type, creditor_name, request_type,
      contract_number || null, debt_amount || null, monthly_income || null,
      dependents || 0, description || null, generated_text
    );

    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Обновить статус заявления
app.patch('/api/applications/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'action'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    db.prepare('UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?')
      .run(status, req.params.id, req.user.id);

    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Удалить заявление
app.delete('/api/applications/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM applications WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Заявление не найдено' });
  }
  res.json({ message: 'Заявление удалено' });
});

// Статистика пользователя
app.get('/api/stats', authMiddleware, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ?').get(req.user.id);
  const approved = db.prepare("SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = 'approved'").get(req.user.id);
  const pending = db.prepare("SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = 'pending'").get(req.user.id);
  const action = db.prepare("SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = 'action'").get(req.user.id);

  res.json({
    total: total.count,
    approved: approved.count,
    pending: pending.count,
    action: action.count,
  });
});

// ===================== AI TEXT GENERATION =====================

function generateApplicationText({ creditor_name, request_type, contract_number, debt_amount, monthly_income, dependents, description }) {
  const date = new Date().toLocaleDateString('ru-RU');
  const formattedDebt = debt_amount ? `${Number(debt_amount).toLocaleString('ru-RU')} ₸` : '___________';
  const formattedIncome = monthly_income ? `${Number(monthly_income).toLocaleString('ru-RU')} ₸` : '___________';
  
  return `Руководителю ${creditor_name}
От гражданина Республики Казахстан

ЗАЯВЛЕНИЕ
о ${request_type.toLowerCase()}

Между мной и ${creditor_name} заключён кредитный договор № ${contract_number || '___________'}. Сумма текущей задолженности составляет ${formattedDebt}.

В связи с изменением финансового положения (ежемесячный доход составляет ${formattedIncome}${dependents && dependents > 0 ? `, количество иждивенцев: ${dependents}` : ''}), прошу рассмотреть возможность ${request_type.toLowerCase()} по указанному договору.

В соответствии со статьей 36 Закона Республики Казахстан «О банках и банковской деятельности», а также Постановлением Правления Национального Банка РК, кредитор обязан рассмотреть обращение заёмщика о реструктуризации задолженности при наличии уважительных причин.

${description ? `Дополнительная информация: ${description}\n` : ''}
Прошу рассмотреть данное заявление в сроки, установленные законодательством РК, и предоставить письменный ответ.

Дата: ${date}
Подпись: ___________`;
}

// ===================== START SERVER =====================

app.listen(PORT, () => {
  console.log(`🚀 KenesHab API сервер запущен на http://localhost:${PORT}`);
  console.log(`📦 Эндпоинты:`);
  console.log(`   POST   /api/auth/otp/send`);
  console.log(`   POST   /api/auth/otp/verify`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/admin/applications (Admin Only)`);
  console.log(`   POST   /api/admin/reply (Admin Only)`);
});
