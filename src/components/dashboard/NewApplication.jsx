import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronLeft, Building2, CreditCard, User, FileText, CheckCircle, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import AuthContext
import './NewApplication.css';

const API_URL = 'http://localhost:3001';

const creditorTypes = [
  { id: 'bank', label: 'Банк (БВУ)', icon: Building2 },
  { id: 'mfo', label: 'МФО', icon: CreditCard },
  { id: 'collector', label: 'Коллектор', icon: User },
];

const requestTypes = [
  'Реструктуризация долга',
  'Отсрочка платежа',
  'Списание пени и штрафов',
  'Досудебное урегулирование',
  'Снижение процентной ставки',
  'Другое',
];

export default function NewApplication() {
  const { user, openAuthModal } = useAuth(); // Use auth context
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    creditorType: '',
    creditorName: '',
    requestType: '',
    contractNumber: '',
    debtAmount: '',
    monthlyIncome: '',
    dependents: '',
    description: '',
  });
  const [generated, setGenerated] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (key, value) => setForm({ ...form, [key]: value });
  const totalSteps = 4;

  const handleGenerate = () => {
    setGenerated(true);
    setStep(3);
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      openAuthModal();
      return;
    }

    setSending(true);
    setError('');

    try {
      const token = localStorage.getItem('keneshab_token');

      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          creditor_type: form.creditorType,
          creditor_name: form.creditorName,
          request_type: form.requestType,
          contract_number: form.contractNumber,
          debt_amount: form.debtAmount ? Number(form.debtAmount) : null,
          monthly_income: form.monthlyIncome ? Number(form.monthlyIncome) : null,
          dependents: form.dependents ? Number(form.dependents) : 0,
          description: form.description,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при отправке');
      }

      setSubmitted(true);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Не удалось отправить заявление. Проверьте, запущен ли сервер.');
    } finally {
      setSending(false);
    }
  };

  const handleNewApplication = () => {
    setStep(1);
    setForm({
      creditorType: '', creditorName: '', requestType: '',
      contractNumber: '', debtAmount: '', monthlyIncome: '',
      dependents: '', description: '',
    });
    setGenerated(false);
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="new-app">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="new-app__title">Новое заявление</h1>
        <p className="new-app__subtitle">ИИ составит юридически грамотное обращение за вас</p>

        {/* Progress */}
        {!submitted && (
          <div className="new-app__progress">
            {[
              { num: 1, label: 'Кредитор' },
              { num: 2, label: 'Данные' },
              { num: 3, label: 'Документ' },
            ].map(({ num, label }) => (
              <div key={num} className={`new-app__progress-step ${step >= num ? 'new-app__progress-step--active' : ''}`}>
                <div className="new-app__progress-dot">{step > num ? '✓' : num}</div>
                <span>{label}</span>
              </div>
            ))}
            <div className="new-app__progress-line">
              <div className="new-app__progress-fill" style={{ width: `${((Math.min(step, 3) - 1) / 2) * 100}%` }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Step 1: Creditor */}
      {step === 1 && (
        <motion.div
          className="new-app__step"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Выберите тип кредитора</h2>
          <div className="new-app__type-grid">
            {creditorTypes.map((type) => (
              <button
                key={type.id}
                className={`new-app__type-card ${form.creditorType === type.id ? 'new-app__type-card--selected' : ''}`}
                onClick={() => updateForm('creditorType', type.id)}
              >
                <type.icon size={28} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          <div className="new-app__field">
            <label>Название кредитора</label>
            <input
              type="text"
              placeholder="Например: Kaspi Bank, Halyk Bank, Solva..."
              value={form.creditorName}
              onChange={(e) => updateForm('creditorName', e.target.value)}
            />
          </div>

          <div className="new-app__field">
            <label>Тип обращения</label>
            <select value={form.requestType} onChange={(e) => updateForm('requestType', e.target.value)}>
              <option value="">Выберите тип обращения</option>
              {requestTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="new-app__actions">
            <div />
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={!form.creditorType || !form.creditorName || !form.requestType}
            >
              Далее <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <motion.div
          className="new-app__step"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Заполните данные</h2>
          <div className="new-app__fields-grid">
            <div className="new-app__field">
              <label>Номер договора</label>
              <input
                type="text"
                placeholder="Например: KZ-2024-12345"
                value={form.contractNumber}
                onChange={(e) => updateForm('contractNumber', e.target.value)}
              />
            </div>
            <div className="new-app__field">
              <label>Сумма задолженности (₸)</label>
              <input
                type="number"
                placeholder="500000"
                value={form.debtAmount}
                onChange={(e) => updateForm('debtAmount', e.target.value)}
              />
            </div>
            <div className="new-app__field">
              <label>Ежемесячный доход (₸)</label>
              <input
                type="number"
                placeholder="200000"
                value={form.monthlyIncome}
                onChange={(e) => updateForm('monthlyIncome', e.target.value)}
              />
            </div>
            <div className="new-app__field">
              <label>Иждивенцы</label>
              <input
                type="number"
                placeholder="0"
                value={form.dependents}
                onChange={(e) => updateForm('dependents', e.target.value)}
              />
            </div>
          </div>

          <div className="new-app__field">
            <label>Дополнительная информация</label>
            <textarea
              placeholder="Опишите вашу ситуацию: причины возникновения задолженности, текущие обстоятельства..."
              rows={4}
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
            />
          </div>

          <div className="new-app__actions">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft size={18} /> Назад
            </button>
            <button className="btn btn-primary" onClick={handleGenerate}>
              <Sparkles size={18} /> Сгенерировать заявление
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Generated Document */}
      {step === 3 && generated && (
        <motion.div
          className="new-app__step"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="new-app__generated-header">
            <FileText size={24} />
            <h2>Заявление сгенерировано</h2>
          </div>

          <div className="new-app__document">
            <div className="new-app__doc-header">
              <p>Руководителю {form.creditorName}</p>
              <p>От гражданина Республики Казахстан</p>
              <br />
              <h3 style={{ textAlign: 'center' }}>ЗАЯВЛЕНИЕ</h3>
              <h4 style={{ textAlign: 'center' }}>о {form.requestType.toLowerCase()}</h4>
              <br />
              <p>
                Между мной и {form.creditorName} заключён кредитный договор № {form.contractNumber || '___________'}. 
                Сумма текущей задолженности составляет {form.debtAmount ? `${Number(form.debtAmount).toLocaleString()} ₸` : '___________'}.
              </p>
              <br />
              <p>
                В связи с изменением финансового положения (ежемесячный доход составляет{' '}
                {form.monthlyIncome ? `${Number(form.monthlyIncome).toLocaleString()} ₸` : '___________'}
                {form.dependents && form.dependents !== '0' ? `, количество иждивенцев: ${form.dependents}` : ''}
                ), прошу рассмотреть возможность {form.requestType.toLowerCase()} по указанному договору.
              </p>
              <br />
              <p>
                В соответствии со статьей 36 Закона Республики Казахстан «О банках и банковской деятельности»,
                а также Постановлением Правления Национального Банка РК, кредитор обязан рассмотреть обращение
                заёмщика о реструктуризации задолженности при наличии уважительных причин.
              </p>
              {form.description && (
                <>
                  <br />
                  <p>Дополнительная информация: {form.description}</p>
                </>
              )}
              <br />
              <p>
                Прошу рассмотреть данное заявление в сроки, установленные законодательством РК, 
                и предоставить письменный ответ.
              </p>
              <br />
              <p>Дата: {new Date().toLocaleDateString('ru-RU')}</p>
              <p>Подпись: ___________</p>
            </div>
          </div>

          {error && (
            <div className="new-app__error">
              ⚠️ {error}
            </div>
          )}

          <div className="new-app__actions">
            <button className="btn btn-secondary" onClick={() => setStep(2)} disabled={sending}>
              <ChevronLeft size={18} /> Редактировать
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 size={18} className="spin" /> Отправка...
                </>
              ) : (
                <>
                  <Send size={18} /> Подписать и отправить
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {step === 4 && submitted && (
        <motion.div
          className="new-app__step new-app__success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="new-app__success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle size={64} />
          </motion.div>
          <h2>Заявление отправлено!</h2>
          <p>Ваше обращение к <strong>{form.creditorName}</strong> успешно сохранено и будет направлено кредитору.</p>
          <p className="new-app__success-sub">Вы можете отслеживать статус в разделе «Мои заявления».</p>
          <div className="new-app__success-actions">
            <Link to="/dashboard/applications" className="btn btn-primary">
              <FileText size={18} /> Мои заявления
            </Link>
            <button className="btn btn-secondary" onClick={handleNewApplication}>
              Новое заявление
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
