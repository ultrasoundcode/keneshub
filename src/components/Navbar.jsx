import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Instagram, MessageCircle, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">K</div>
          <span className="navbar__logo-text">KenesHab</span>
        </Link>

        {/* Backdrop for closing mobile menu */}
        {mobileOpen && (
          <div 
            className="navbar__overlay" 
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <a href="#problems" onClick={() => setMobileOpen(false)}>Проблемы</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>Как это работает</a>
          <a href="#features" onClick={() => setMobileOpen(false)}>Преимущества</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)}>Тарифы</a>
          
          <div className="navbar__mobile-actions">
            <div className="navbar__mobile-socials">
              <a href="https://wa.me/77712292976" target="_blank" rel="noopener noreferrer" className="navbar__social-icon whatsapp">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.instagram.com/keneshub.kz?igsh=MWowejN4b3p3OTN1aw==" target="_blank" rel="noopener noreferrer" className="navbar__social-icon instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@keneshub.kz?_r=1&_t=ZS-943Tr2Y12Uj" target="_blank" rel="noopener noreferrer" className="navbar__social-icon tiktok">
                <Music size={20} />
              </a>
            </div>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                <User size={18} /> Личный кабинет
              </Link>
            ) : (
              <button 
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal();
                }} 
                className="btn btn-primary"
              >
                Войти в кабинет
              </button>
            )}
          </div>
        </div>

        <div className="navbar__actions">
          <div className="navbar__desktop-socials">
            <a href="https://wa.me/77712292976" target="_blank" rel="noopener noreferrer" className="navbar__social-icon whatsapp" title="WhatsApp">
              <MessageCircle size={20} />
            </a>
            <a href="https://www.instagram.com/keneshub.kz?igsh=MWowejN4b3p3OTN1aw==" target="_blank" rel="noopener noreferrer" className="navbar__social-icon instagram" title="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.tiktok.com/@keneshub.kz?_r=1&_t=ZS-943Tr2Y12Uj" target="_blank" rel="noopener noreferrer" className="navbar__social-icon tiktok" title="TikTok">
              <Music size={20} />
            </a>
          </div>
          {user ? (
            <div className="navbar__user">
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <User size={16} /> Кабинет
              </Link>
            </div>
          ) : (
            <button onClick={openAuthModal} className="btn btn-primary btn-sm">
              Войти в кабинет
            </button>
          )}

          <button className="navbar__burger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
