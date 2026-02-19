import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useAnimations';
import { Quote, Star } from 'lucide-react';
import './Reviews.css';

const testimonials = [
  {
    name: 'Азамат К.',
    role: 'Заемщик',
    text: 'Был долг в трех МФО, не знал как подступиться. Сервис помог составить грамотные заявления, и в одном случае даже списали пеню. Очень удобно!',
    rating: 5,
  },
  {
    name: 'Мадина С.',
    role: 'Предприниматель',
    text: 'Для меня было важно быстро решить вопрос с банком. ИИ подготовил документ за пару минут, поддержка ответила на все мои вопросы. Рекомендую.',
    rating: 5,
  },
  {
    name: 'Берик Т.',
    role: 'Заемщик',
    text: 'Честно говоря, не верил, что это сработает. Но после отправки заявления банк предложил реструктуризацию. Спасибо команде KenesHab!',
    rating: 5,
  },
];

export default function Reviews() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="reviews" className="reviews" ref={ref}>
      <div className="container">
        <div className={`reviews__header animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-badge">💬 Отзывы</span>
          <h2 className="section-title">Что говорят <span className="gradient-text">наши пользователи</span></h2>
          <p className="section-subtitle">
            Мы уже помогли тысячам людей найти общий язык с кредиторами и облегчить долговую нагрузку.
          </p>
        </div>

        <div className="reviews__grid">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              className={`reviews__card animate-on-scroll delay-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div className="reviews__quote-icon">
                <Quote size={24} />
              </div>
              <div className="reviews__stars">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent-blue)" color="var(--accent-blue)" />
                ))}
              </div>
              <p className="reviews__text">"{testi.text}"</p>
              <div className="reviews__author">
                <div className="reviews__author-info">
                  <span className="reviews__author-name">{testi.name}</span>
                  <span className="reviews__author-role">{testi.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
