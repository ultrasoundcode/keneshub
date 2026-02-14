import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import TypewriterText from './ui/TypewriterText';
import './Hero.css';

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Google Antigravity colors + Brand colors
    const colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#8B5CF6', '#00D4FF'];
    
    let particles = [];
    const particleCount = 200; // Adjust for density

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        // Start from random depth if initial, else start far away
        this.z = initial ? Math.random() * 2000 : 2000;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 2 + 1; // Random size
        // Speed depends on z to create parallax-like feel or just constant forward movement
        this.speed = 15; 
      }

      update() {
        this.z -= this.speed;
        
        // Reset if particle passes the screen
        if (this.z <= 1) {
          this.reset();
        }
      }

      draw() {
        // Perspective projection
        // Simple perspective: x' = x / z * constant
        const fov = 300;
        const scale = fov / (fov + this.z);
        
        // Center of screen
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const x2d = (this.x - cx) * scale + cx; // This formulation might be wrong for "flying through"
        // Correct standard 3D projection:
        // x' = x * (focalLength / z) + centerX
        
        // Let's use a simpler starfield logic:
        // x,y are relative to center.
        // As z decreases, they move away from center.
        
        // Current approach: x, y are static world coordinates. Z decreases.
        // We project world to screen.
        
        // Let's retry coordinates:
        // origin is center screen (0,0,0) implied.
        // x,y range from -W to W, -H to H.
        
        // However, in reset() I used canvas.width. Let's shift to center relative.
        
        const px = (this.x / this.z) * 500 + cx;
        const py = (this.y / this.z) * 500 + cy;

        // Calculate size based on depth
        const size = (1 - this.z / 2000) * 4 * this.size;

        if (this.z > 0 && px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(px, py, Math.max(0, size), 0, Math.PI * 2);
            ctx.fill();
        }
      }
    }
    
    // Improved Particle Logic for "Antigravity" confetti feel
    // Antigravity has particles that might float or explode. 
    // The user mentioned "liftoff", which usually implies movement UP or Forward.
    // The starfield (warpspeed) is "Forward". 
    // Let's do a "Forward" warp speed with colorful confetti.

    // Re-initializing particles with centered coordinates
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        // Correct start positions for starfield
        p.x = (Math.random() - 0.5) * canvas.width * 5; // Spread wide
        p.y = (Math.random() - 0.5) * canvas.height * 5;
        particles.push(p);
    }

    const animate = () => {
      // Create trailing effect or just clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        // Custom draw inside loop to use closure vars if needed, or call p.draw()
        // Perspective projection
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        // Simple 3D projection
        // z goes from 2000 to 1.
        const scale = 500 / p.z; 
        const px = p.x * scale + cx;
        const py = p.y * scale + cy;
        
        const size = p.size * scale; // Scale size by perspective

        if (p.z > 1 && px > -50 && px < canvas.width + 50 && py > -50 && py < canvas.height + 50) {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            // Draw as slight ovals or lines to simulate speed? Or just dots for confetti.
            // Confetti usually rotates, but dots are fine for now.
            ctx.arc(px, py, Math.max(0.1, size), 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
};

export default function Hero() {
  return (
    <section className="hero">
      {/* Background effects */}
      <div className="hero__bg">
        <ParticleAnimation />
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
          Путь к <span className="gradient-text"><TypewriterText text="договорённости" delay={1000} /></span>
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
      </div>
    </section>
  );
}
