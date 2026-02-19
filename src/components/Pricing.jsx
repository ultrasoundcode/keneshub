import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TypewriterText from './ui/TypewriterText';
import './Pricing.css';

const plans = [
  {
    name: 'Базовый',
    price: 'Бесплатно',
    period: '',
    description: 'Для первых шагов',
    features: [
      'Подача заявления',
      'Базовые шаблоны',
      'Просмотр статуса',
    ],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Стандарт',
    price: '3 000 ₸',
    period: '/ документ',
    description: 'Оптимальный выбор',
    features: [
      'Подача заявления',
      'Ускоренное рассмотрение',
      'ИИ-генерация документов',
      'Email-уведомления',
    ],
    cta: 'Выбрать Стандарт',
    popular: true,
  },
  {
    name: 'Про',
    price: '7 000 ₸',
    period: '/ документ',
    description: 'Полное сопровождение',
    features: [
      'Ускоренное рассмотрение',
      'Помощь юриста',
      'Безлимитные заявления',
      'Приоритетная поддержка',
      'ЭЦП-подпись',
    ],
    cta: 'Подключить Про',
    popular: false,
  },
];

export default function Pricing() {
  const [ref, isVisible] = useScrollReveal();
  const { openAppModal } = useAuth();

  return (
    <section id="pricing" className="pricing" ref={ref}>
      <div className="container">
        <div className={`pricing__header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-badge">💎 Тарифы</span>
          <h2 className="section-title">
            {isVisible ? (
              <>
                Выберите <span className="gradient-text"><TypewriterText text="свой план" delay={500} /></span>
              </>
            ) : (
              // Placeholder to prevent layout shift before animation starts
              <span style={{ visibility: 'hidden' }}>Выберите свой план</span>
            )}
          </h2>
          <p className="section-subtitle">
            Начните бесплатно или выберите план с расширенными возможностями
          </p>
        </div>

        <div className="pricing__grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing__card ${plan.popular ? 'pricing__card--popular' : ''} animate-on-scroll delay-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              {plan.popular && (
                <div className="pricing__card-badge">
                  Популярный
                </div>
              )}
              <div className="pricing__card-header">
                <h3 className="pricing__card-name">{plan.name}</h3>
                <div className="pricing__card-price">
                  <span className="pricing__card-amount">{plan.price}</span>
                  <span className="pricing__card-period">/ документ</span>
                </div>
              </div>
              <p className="pricing__card-desc">{plan.description}</p>
              <ul className="pricing__card-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check className="pricing__check" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={openAppModal}
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
