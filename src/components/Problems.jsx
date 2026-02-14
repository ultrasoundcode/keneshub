import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Layout, ShieldAlert, UserX } from 'lucide-react';
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
    icon: Layout,
    title: 'Нет единого механизма',
    description: 'Отсутствие универсального инструмента для досудебного урегулирования споров с кредиторами.',
    color: '#3b82f6'
  },
  {
    icon: ShieldAlert,
    title: 'Сложность процедур',
    description: 'Запутанные банковские процессы и необходимость знания юридических тонкостей законодательства РК.',
    color: '#f59e0b'
  },
  {
    icon: UserX,
    title: 'Высокая стоимость юристов',
    description: 'Услуги профессиональных юристов часто недоступны для людей, уже находящихся в тяжелой ситуации.',
    color: '#10b981'
  }
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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

        <div className="problems__grid">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="problems__card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 1, 
                delay: index * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              style={{ '--card-color': problem.color }}
            >
              <div className="problems__card-icon">
                <problem.icon size={32} />
              </div>
              <h3 className="problems__card-title">{problem.title}</h3>
              <p className="problems__card-desc">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
