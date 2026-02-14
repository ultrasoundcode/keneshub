import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';
import { UserCheck, Cpu, FileCheck, Send } from 'lucide-react';
import TypewriterText from './ui/TypewriterText';
import './HowItWorks.css';

const steps = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Заполните анкету',
    description: 'Укажите данные о кредите, кредиторе и вашей текущей финансовой ситуации.',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'ИИ составит заявление',
    description: 'Искусственный интеллект сформирует юридически грамотное обращение по нормам РК.',
  },
  {
    icon: FileCheck,
    step: '03',
    title: 'Проверьте и подпишите',
    description: 'Просмотрите сгенерированный документ, внесите правки и подпишите ЭЦП.',
  },
  {
    icon: Send,
    step: '04',
    title: 'Отправьте кредитору',
    description: 'Заявление будет направлено в банк, МФО или коллекторское агентство через платформу.',
  },
];

export default function HowItWorks() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="how-it-works" className="how-it-works" ref={ref}>
      <div className="container">
        <div className={`how-it-works__header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-badge">🔧 Процесс</span>
          <h2 className="section-title">
            Как <span className="gradient-text">
              {isVisible ? <TypewriterText text="это работает" delay={200} /> : <span style={{visibility:'hidden'}}>это работает</span>}
            </span>
          </h2>
          <p className="section-subtitle">
            Четыре простых шага от проблемы к решению — всё автоматизировано
          </p>
        </div>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`how-it-works__step animate-on-scroll delay-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="how-it-works__step-number">Шаг {step.step}</div>
              <div className="how-it-works__step-icon">
                <step.icon size={32} />
              </div>
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
