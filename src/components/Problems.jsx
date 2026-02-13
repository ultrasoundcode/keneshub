import { useScrollReveal } from '../hooks/useAnimations';
import { TrendingDown, AlertTriangle, Scale, MessageSquareX } from 'lucide-react';
import './Problems.css';

const problems = [
  {
    icon: TrendingDown,
    title: 'Рост задолженности',
    description: 'Просроченные кредиты растут, а вместе с ними — штрафы и пени, усугубляя финансовое положение.',
    color: '#ef4444',
  },
  {
    icon: AlertTriangle,
    title: 'Нет единого механизма',
    description: 'Отсутствие универсального инструмента для досудебного урегулирования споров с кредиторами.',
    color: '#f59e0b',
  },
  {
    icon: Scale,
    title: 'Низкая юр. грамотность',
    description: 'Большинство заёмщиков не знают своих прав и не могут правильно составить обращение к кредитору.',
    color: '#8b5cf6',
  },
  {
    icon: MessageSquareX,
    title: 'Сложная коммуникация',
    description: 'Общение с банками, МФО и коллекторами вызывает стресс и часто не приводит к результату.',
    color: '#ec4899',
  },
];

export default function Problems() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="problems" className="problems" ref={ref}>
      <div className="container">
        <div className={`problems__header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-badge">⚠️ Проблема</span>
          <h2 className="section-title">
            Почему заёмщикам <span className="gradient-text">сложно</span>
          </h2>
          <p className="section-subtitle">
            Миллионы казахстанцев столкнулись с проблемной задолженностью, но не знают как защитить свои права
          </p>
        </div>

        <div className="problems__grid">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`problems__card animate-on-scroll delay-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="problems__card-icon" style={{ '--card-color': problem.color }}>
                <problem.icon size={24} />
              </div>
              <h3 className="problems__card-title">{problem.title}</h3>
              <p className="problems__card-desc">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
