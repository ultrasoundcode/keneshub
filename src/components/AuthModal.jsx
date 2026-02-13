import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const API_URL = 'http://localhost:3001';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [step, setStep] = useState(1); // 1: Contact, 2: OTP
  const [type, setType] = useState('phone'); // phone | email
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, type, name }),
      });

      if (!res.ok) throw new Error('Ошибка отправки кода');

      setStep(2);
    } catch (err) {
      setError(err.message || 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const otp = code.join('');
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, code: otp }),
      });

      if (!res.ok) throw new Error('Неверный код');

      const data = await res.json();
      login(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Ошибка проверки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCode = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="auth-overlay">
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="auth-close" onClick={closeAuthModal}>
          <X size={20} />
        </button>

        <div className="auth-content">
          <div className="auth-header">
            <h2>Вход в кабинет</h2>
            <p>Войдите, чтобы управлять заявлениями</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendCode}>
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${type === 'phone' ? 'active' : ''}`}
                  onClick={() => setType('phone')}
                >
                  <Phone size={16} /> Телефон
                </button>
                <button
                  type="button"
                  className={`auth-tab ${type === 'email' ? 'active' : ''}`}
                  onClick={() => setType('email')}
                >
                  <Mail size={16} /> Email
                </button>
              </div>

              <div className="auth-field">
                <label>Ваше имя</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label>{type === 'phone' ? 'Номер телефона' : 'Email адрес'}</label>
                <input
                  type={type === 'phone' ? 'tel' : 'email'}
                  placeholder={type === 'phone' ? '+7 (7__) ___-__-__' : 'example@mail.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <Loader2 className="spin" /> : 'Получить код'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="auth-sent-info">
                <p>Мы отправили код на <strong>{contact}</strong></p>
                <button type="button" onClick={() => setStep(1)} className="auth-change-link">
                  Изменить
                </button>
              </div>

              <div className="auth-otp-group">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChangeCode(idx, e.target.value)}
                    className="auth-otp-input"
                  />
                ))}
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <Loader2 className="spin" /> : 'Войти'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
