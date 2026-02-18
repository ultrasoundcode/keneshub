import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: 'Как работает услуга досудебного урегулирования?',
    answer: 'Наша платформа использует ИИ для анализа вашей финансовой ситуации и автоматического формирования юридически грамотного заявления в банк или МФО. Вы подписываете документ ЭЦП и отправляете его через наш сервис.',
  },
  {
    question: 'Нужно ли мне платить юристу?',
    answer: 'Нет, наш сервис автоматизирует работу юриста. Вы получаете готовый документ за несколько минут по фиксированной цене, которая значительно ниже стоимости услуг профессионального юриста.',
  },
  {
    question: 'Как подписать заявление?',
    answer: 'Вы можете подписать сформированный документ электронной цифровой подписью (ЭЦП) прямо на нашей платформе с помощью интеграции с NCALayer.',
  },
  {
    question: 'Какие банки и МФО принимают ваши заявления?',
    answer: 'Заявления, сформированные нашей платформой, соответствуют законодательству РК и обязательны к рассмотрению всеми банками второго уровня, микрофинансовыми организациями и коллекторскими агентствами Республики Казахстан.',
  },
  {
    question: 'Что делать, если банк отказал?',
    answer: 'В случае отказа мы предоставляем рекомендации по дальнейшим действиям, включая возможность обращения к банковскому омбудсмену или в АРРФР (Агентство по регулированию и развитию финансового рынка).',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="faq">
      <div className="container">
        <motion.div 
          className="faq__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge">❓ FAQ</span>
          <h2 className="section-title">Часто задаваемые вопросы</h2>
          <p className="section-subtitle">Всё, что вам нужно знать о работе сервиса KenesHab</p>
        </motion.div>

        <div className="faq__container">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
            >
              <button 
                className="faq__question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <ChevronDown className="faq__icon" size={20} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="faq__answer">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
