import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, CreditCard, User, FileText, ChevronRight, ChevronLeft, Sparkles, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TypewriterText from './ui/TypewriterText';
import './ApplicationModal.css';

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

const tariffs = [
  { id: 'free', name: 'Базовый', price: '0 ₸', features: ['1 заявление', 'Базовый шаблон'] },
  { id: 'pro', name: 'Про', price: '3 000 ₸', features: ['Безлимит', 'ИИ-генерация', 'ЭЦП'] },
  { id: 'biz', name: 'Бизнес', price: '10 000 ₸', features: ['Персональный юрист', 'Приоритет'] },
];

export default function ApplicationModal() {
  const { isAppModalOpen, closeAppModal, user, openAuthModal } = useAuth();
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
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // If user logs in while modal is open and we were waiting for auth
  useEffect(() => {
    if (user && step === 3.5) {
      setStep(4);
    }
  }, [user, step]);

  if (!isAppModalOpen) return null;

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleNext = () => {
    if (step === 3) {
      if (!user) {
        setStep(3.5); // Waiting for auth state
        openAuthModal();
      } else {
        setStep(4); // Go to tariffs
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => setStep(Math.max(1, step - 1));

  const handleTariffSelect = (tariffId) => {
    setSelectedTariff(tariffId);
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setStep(5);
    }, 1500);
  };

  return (
    <div className="app-modal" onClick={closeAppModal}>
      <motion.div 
        className="app-modal__content" 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <button className="app-modal__close" onClick={closeAppModal}>
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="app-modal__step-title">Выберите кредитора</h2>
              <p className="app-modal__step-subtitle">Шаг 1 из 3: Информация о кредитной организации</p>
              
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
                  placeholder="Например: Kaspi Bank, Halyk Bank..."
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <button 
                  className="btn btn-primary" 
                  disabled={!form.creditorType || !form.creditorName || !form.requestType}
                  onClick={handleNext}
                >
                  Далее <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="app-modal__step-title">Детали задолженности</h2>
              <p className="app-modal__step-subtitle">Шаг 2 из 3: Финансовые показатели</p>

              <div className="new-app__fields-grid">
                <div className="new-app__field">
                  <label>Номер договора</label>
                  <input
                    type="text"
                    placeholder="KZ-2024-..."
                    value={form.contractNumber}
                    onChange={(e) => updateForm('contractNumber', e.target.value)}
                  />
                </div>
                <div className="new-app__field">
                  <label>Сумма задолженности (₸)</label>
                  <input
                    type="number"
                    value={form.debtAmount}
                    onChange={(e) => updateForm('debtAmount', e.target.value)}
                  />
                </div>
                <div className="new-app__field">
                  <label>Ежемесячный доход (₸)</label>
                  <input
                    type="number"
                    value={form.monthlyIncome}
                    onChange={(e) => updateForm('monthlyIncome', e.target.value)}
                  />
                </div>
                <div className="new-app__field">
                  <label>Иждивенцы</label>
                  <input
                    type="number"
                    value={form.dependents}
                    onChange={(e) => updateForm('dependents', e.target.value)}
                  />
                </div>
              </div>

              <div className="new-app__field">
                <label>Причина просрочки</label>
                <textarea
                  placeholder="Опишите кратко причину сложности выплат..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={handlePrev}>
                  <ChevronLeft size={18} /> Назад
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Сгенерировать <Sparkles size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="app-modal__step-title">Предпросмотр заявления</h2>
              <p className="app-modal__step-subtitle">Шаг 3 из 3: ИИ сформировал документ</p>

              <div className="new-app__document">
                <p>Руководителю {form.creditorName}</p>
                <p>ЗАЯВЛЕНИЕ о {form.requestType.toLowerCase()}</p>
                <p>Настоящим сообщаю, что по договору № {form.contractNumber || '___'} имею задолженность в размере {form.debtAmount || '___'}. В связи с текущей ситуацией ({form.description || 'изменение дохода'}) прошу рассмотреть реструктуризацию.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={handlePrev}>
                  <ChevronLeft size={18} /> Редактировать
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Отправить заявление <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3.5 && (
            <motion.div key="step35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <h2 className="app-modal__step-title">Почти готово!</h2>
              <p className="app-modal__step-subtitle">Для отправки заявления необходимо войти в систему</p>
              <div style={{ marginTop: 20 }}>
                <Loader2 className="spin" size={48} style={{ margin: '0 auto', color: 'var(--accent-blue)' }} />
              </div>
              <p style={{ marginTop: 20 }}>Пожалуйста, завершите вход в появившемся окне...</p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="app-modal__step-title">Выберите тариф</h2>
              <p className="app-modal__step-subtitle">Выберите подходящий план для обработки заявления</p>

              <div className="tariff-grid">
                {tariffs.map((t) => (
                  <div key={t.id} className="tariff-card" onClick={() => handleTariffSelect(t.id)}>
                    <h3>{t.name}</h3>
                    <div className="tariff-price">{t.price}</div>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
                      {t.features.map(f => <li key={f}>• {f}</li>)}
                    </ul>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>Выбрать</button>
                  </div>
                ))}
              </div>
              
              {isSending && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <Loader2 className="spin" size={40} />
                    <p>Обработка...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="app-info-page">
              <div style={{ color: '#10b981', marginBottom: 20 }}>
                <CheckCircle size={64} style={{ margin: '0 auto' }} />
              </div>
              <h2 className="app-modal__step-title">Заявление отправлено!</h2>
              <p className="app-modal__step-subtitle">Ваше обращение успешно зарегистрировано в системе</p>

              <div className="app-info-card">
                <h3>Страница заявителя</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 15 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ФИО</label>
                    <p>{user?.name || 'Пользователь'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Телефон</label>
                    <p>{user?.phone || 'Не указан'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Заявление</label>
                    <p>к {form.creditorName}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Статус</label>
                    <p><span className="status-badge">На рассмотрении</span></p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: 30, width: '100%' }} onClick={closeAppModal}>
                Перейти в личный кабинет
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
