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

    // Generate fixed code for easier development
    const code = '7777';
    
    // Save to store (expires in 5 mins)
    otpStore.set(contact, { code, name, expires: Date.now() + 5 * 60 * 1000 });

    console.log(`🔐 OTP code for ${contact}: ${code}`); // Always log for backup

    if (type === 'email') {
      try {
        // Mock email sending for development stability
        // await transporter.sendMail({
        //   from: '"KenesHab Support" <noreply@keneshab.kz>',
        //   to: contact,
        //   subject: 'Ваш код подтверждения KenesHab',
        //   text: `Здравствуйте, ${name}!\n\nВаш код для входа: ${code}\n\nКод действителен 5 минут.`,
        //   html: `<div style="font-family: sans-serif; padding: 20px;">
        //     <h2>KenesHab</h2>
        //     <p>Здравствуйте, <strong>${name}</strong>!</p>
        //     <p>Ваш код для входа в личный кабинет:</p>
        //     <h1 style="color: #00d4ff; letter-spacing: 5px;">${code}</h1>
        //     <p>Код действителен 5 минут.</p>
        //     <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        //     <p style="color: #888; font-size: 12px;">Если вы не запрашивали код, проигнорируйте это письмо.</p>
        //   </div>`
        // });
        console.log(`📧 Email sent to ${contact} (MOCKED)`);
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
        // Don't fail the request, allowing user to get code from console/admin panel in worst case
        // But for user experience, maybe warn them? 
        // For now, let's proceed as success so frontend shows input field, user can check console or ask admin.
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

    if (record.code !== code) {
      return res.status(400).json({ error: 'Неверный код' });
    }

    // Code is valid - find or create user
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?').get(contact, contact);

    if (!user) {
      // Create new user
      const id = uuidv4();
      // For simplicity in this logical flow, we just put the contact in the right column
      // Ideally we'd validte if it's email or phone, but for this demo we can try to guess or use the type passed earlier (but we don't have it here without saving it).
      // Let's assume contact is email if it has @, else phone.
      const isEmail = contact.includes('@');
      
      db.prepare(
        `INSERT INTO users (id, email, phone, full_name, password_hash) VALUES (?, ?, ?, ?, ?)`
      ).run(
        id, 
        isEmail ? contact : null, 
        isEmail ? null : contact, 
        record.name,
        'otp-user' // Placeholder for password hash as we use OTP
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

// ===================== APPLICATIONS ROUTES =====================

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
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   PUT    /api/auth/me`);
  console.log(`   GET    /api/applications`);
  console.log(`   POST   /api/applications`);
  console.log(`   GET    /api/applications/:id`);
  console.log(`   PATCH  /api/applications/:id/status`);
  console.log(`   DELETE /api/applications/:id`);
  console.log(`   GET    /api/stats`);
});
