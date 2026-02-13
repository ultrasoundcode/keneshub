import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="profile__title">Профиль</h1>
        <p className="profile__subtitle">Управление вашим аккаунтом</p>
      </motion.div>

      <div className="profile__grid">
        <motion.div
          className="profile__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="profile__avatar-section">
            <div className="profile__avatar">АН</div>
            <div>
              <h3>Аскат Нарбаев</h3>
              <p>Пользователь с января 2025</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="profile__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="profile__card-title">Личные данные</h3>
          <div className="profile__fields">
            <div className="profile__field">
              <label><User size={14} /> ФИО</label>
              <input type="text" defaultValue="Нарбаев Аскат Ерболатович" />
            </div>
            <div className="profile__field">
              <label><Mail size={14} /> Email</label>
              <input type="email" defaultValue="askat@example.com" />
            </div>
            <div className="profile__field">
              <label><Phone size={14} /> Телефон</label>
              <input type="tel" defaultValue="+7 (707) 123-45-67" />
            </div>
            <div className="profile__field">
              <label><MapPin size={14} /> ИИН</label>
              <input type="text" defaultValue="990101350123" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20 }}>
            <Save size={16} /> Сохранить
          </button>
        </motion.div>

        <motion.div
          className="profile__card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="profile__card-title">Тарифный план</h3>
          <div className="profile__plan">
            <div className="profile__plan-badge">Про</div>
            <div>
              <p className="profile__plan-name">Тариф «Про»</p>
              <p className="profile__plan-price">3 000 ₸/мес</p>
            </div>
          </div>
          <p className="profile__plan-desc">Безлимитные заявления, ИИ-генерация, ЭЦП-подпись, все шаблоны</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }}>
            Управление подпиской
          </button>
        </motion.div>
      </div>
    </div>
  );
}
