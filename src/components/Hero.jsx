import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useAnimations';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const { x, y } = useParallax();

  return (
    <section className="hero">
      {/* Background effects */}
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" style={{ transform: `translate(${x * 20}px, ${y * 20}px)` }} />
        <div className="hero__orb hero__orb--2" style={{ transform: `translate(${x * -15}px, ${y * -15}px)` }} />
        <div className="hero__orb hero__orb--3" style={{ transform: `translate(${x * 10}px, ${y * -10}px)` }} />
        <div className="hero__grid" />
      </div>

      <div className="hero__content container">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={14} />
          <span>ИИ-платформа для урегулирования долгов</span>
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Путь к <span className="gradient-text">договорённости</span>
          <br />начинается здесь
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          KenesHab — цифровой сервис досудебного урегулирования задолженности.
          ИИ автоматически составит юридически грамотное заявление по нормам законодательства РК.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/dashboard/new" className="btn btn-primary btn-lg">
            Подать заявление <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            Как это работает
          </a>
        </motion.div>

        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="hero__stat">
            <span className="hero__stat-number">10,000+</span>
            <span className="hero__stat-label">Обращений обработано</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">87%</span>
            <span className="hero__stat-label">Успешных решений</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">3 мин</span>
            <span className="hero__stat-label">Среднее время создания</span>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="hero__floating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <div className="hero__float-card hero__float-card--1" style={{ transform: `translate(${x * 25}px, ${y * 25}px)` }}>
            <Shield size={20} className="hero__float-icon" />
            <span>ЭЦП подпись</span>
          </div>
          <div className="hero__float-card hero__float-card--2" style={{ transform: `translate(${x * -20}px, ${y * -20}px)` }}>
            <Sparkles size={20} className="hero__float-icon" />
            <span>ИИ генерация</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
