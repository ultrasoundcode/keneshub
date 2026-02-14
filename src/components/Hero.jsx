import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TypewriterText from './ui/TypewriterText';
import './Hero.css';

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Antigravity style colors: Blue, Red, Yellow, Green, Violet (Soft/Pastel)
    const colors = [
      'rgba(66, 133, 244, 0.4)',  // Blue
      'rgba(219, 68, 55, 0.4)',   // Red
      'rgba(244, 180, 0, 0.4)',   // Yellow
      'rgba(15, 157, 88, 0.4)',   // Green
      'rgba(167, 139, 250, 0.4)'  // Violet
    ];
    
    let particles = [];
    const particleCount = 20;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 120 + 60; // Large soft blobs
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.4; // Very slow movement
        this.vy = (Math.random() - 0.5) * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -200) this.x = canvas.width + 200;
        if (this.x > canvas.width + 200) this.x = -200;
        if (this.y < -200) this.y = canvas.height + 200;
        if (this.y > canvas.height + 200) this.y = -200;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
};

export default function Hero() {
  const { openAuthModal } = useAuth();

  return (
    <section className="hero">
      <div className="antigravity-glow" />
      <ParticleAnimation />
      
      <div className="container hero__container">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles size={16} color="var(--accent-blue)" />
          <span>ИИ-платформа для урегулирования долгов</span>
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Путь к <span className="gradient-text"><TypewriterText text="договорённости" delay={1000} /></span>
          <br />начинается здесь
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          KenesHab — цифровой сервис досудебного урегулирования задолженности.
          ИИ автоматически составит юридически грамотное заявление по нормам законодательства РК.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button onClick={openAuthModal} className="btn btn-primary btn-lg">
            Подать заявление
            <ArrowRight size={20} />
          </button>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">
            Как это работает
          </a>
        </motion.div>

        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
      </div>
    </section>
  );
}
