import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, AlertTriangle, Scale, MessageSquareX } from 'lucide-react';
import TypewriterText from './ui/TypewriterText';
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    }
  },
};

export default function Problems() {
  const [startTyping, setStartTyping] = React.useState(false);

  return (
    <section id="problems" className="problems">
      <div className="container">
        <motion.div 
          className="problems__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setStartTyping(true)}
        >
          <span className="section-badge">⚠️ Проблема</span>
          <h2 className="section-title">
            Почему заёмщикам <span className="gradient-text">
              {startTyping ? <TypewriterText text="сложно" delay={200} /> : <span style={{visibility:'hidden'}}>сложно</span>}
            </span>
          </h2>
          <p className="section-subtitle">
            Миллионы казахстанцев столкнулись с проблемной задолженностью, но не знают как защитить свои права
          </p>
        </motion.div>

        <motion.div 
          className="problems__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="problems__card"
              variants={cardVariants}
            >
              <div className="problems__card-icon" style={{ '--card-color': problem.color }}>
                <problem.icon size={24} />
              </div>
              <h3 className="problems__card-title">{problem.title}</h3>
              <p className="problems__card-desc">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
