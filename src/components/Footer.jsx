import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Music } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">K</div>
              <span className="footer__logo-text">KenesHab</span>
            </Link>
            <p className="footer__brand-desc">
              Цифровой сервис досудебного урегулирования задолженности с ИИ-помощником
            </p>
            <div className="footer__socials">
              <a href="https://wa.me/77712292976" target="_blank" rel="noopener noreferrer" className="footer__social-icon whatsapp">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.instagram.com/keneshub.kz?igsh=MWowejN4b3p3OTN1aw==" target="_blank" rel="noopener noreferrer" className="footer__social-icon instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@keneshub.kz?_r=1&_t=ZS-943Tr2Y12Uj" target="_blank" rel="noopener noreferrer" className="footer__social-icon tiktok">
                <Music size={20} />
              </a>
            </div>
          </div>

          <div className="footer__links-group">
            <h4>Платформа</h4>
            <a href="#how-it-works">Как это работает</a>
            <a href="#features">Преимущества</a>
            <a href="#pricing">Тарифы</a>
            <Link to="/dashboard">Личный кабинет</Link>
          </div>

          <div className="footer__links-group">
            <h4>Юридическое</h4>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
            <a href="#">Оферта</a>
          </div>

          <div className="footer__links-group">
            <h4>Контакты</h4>
            <p className="footer__info-text">Адрес: ЖК Шугыла City, микрорайон Шугыла, 340/4 к12</p>
            <a href="https://2gis.kz/almaty/geo/70000001109725313" target="_blank" rel="noopener noreferrer">Карта (BirTime)</a>
            <a href="https://wa.me/77712292976">WhatsApp: 87712292976</a>
          </div>

          <div className="footer__links-group">
            <h4>Разработка</h4>
            <a href="https://github.com/ultrasoundcode" target="_blank" rel="noopener noreferrer">ultrasoundcode</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2025 KenesHab. Все права защищены. Резидент Astana Hub.</p>
          <p className="footer__legal">ТОО «KenesHab» | БИН: xxxxxxxxxx | Республика Казахстан</p>
        </div>
      </div>
    </footer>
  );
}
