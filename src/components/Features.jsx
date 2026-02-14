import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';
import { Brain, ShieldCheck, Globe, Bell, Zap, BarChart3 } from 'lucide-react';
import TypewriterText from './ui/TypewriterText';
import './Features.css';

const features = [
  {
    icon: Brain,
    title: 'ИИ-генерация документов',
    description: 'Искусственный интеллект формирует юридически грамотные заявления на основе законодательства РК.',
    gradient: 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
  },
  {
    icon: ShieldCheck,
    title: 'Интеграция с ЭЦП',
    description: 'Подписывайте документы электронной цифровой подписью прямо на платформе через NCALayer.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  },
  {
    icon: Globe,
    title: 'Единое окно подачи',
    description: 'Отправляйте заявления в любой банк, МФО или коллекторское агентство через одну платформу.',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    icon: Bell,
    title: 'Уведомления о статусе',
    description: 'Получайте уведомления о ходе рассмотрения вашего обращения в реальном времени.',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    icon: Zap,
    title: 'Быстрая обработка',
    description: 'Заявление формируется за 3 минуты вместо нескольких дней ожидания у юриста.',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
  {
    icon: BarChart3,
    title: 'Аналитика обращений',
    description: 'Отслеживайте историю всех обращений, статусы и результаты в личном кабинете.',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
  },
];

export default function Features() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="features" className="features" ref={ref}>
      <div className="container">
        <div className={`features__header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-badge">✨ Преимущества</span>
          <h2 className="section-title">
            Всё что нужно в <span className="gradient-text">
              {isVisible ? <TypewriterText text="одном месте" delay={200} /> : <span style={{visibility:'hidden'}}>одном месте</span>}
            </span>
          </h2>
          <p className="section-subtitle">
            Передовые технологии для защиты ваших прав — просто, быстро и юридически грамотно
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`features__card animate-on-scroll delay-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="features__card-icon">
                <feature.icon size={28} />
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
