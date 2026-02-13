import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FilePlus, User, LogOut, Menu, X, Bell, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    setSidebarOpen(false);
    // If trying to access protected routes without auth, block and show modal
    // But since we use NavLink/Link, the ProtectedRoute component will handle the redirect/block usually.
    // However, for better UX in the sidebar, we might want to intercept.
    // For now, let's let the router handle it or hide the links.
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Обзор', path: '/dashboard', requiredAuth: true },
    { icon: FileText, label: 'Мои заявления', path: '/dashboard/applications', requiredAuth: true },
    { icon: FilePlus, label: 'Новое заявление', path: '/dashboard/new', requiredAuth: false },
    { icon: User, label: 'Профиль', path: '/dashboard/profile', requiredAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.requiredAuth || user);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`dashboard__sidebar ${sidebarOpen ? 'dashboard__sidebar--open' : ''}`}>
        <div className="dashboard__sidebar-header">
          <Link to="/" className="dashboard__logo">
            <div className="dashboard__logo-icon">K</div>
            <span className="dashboard__logo-text">KenesHab</span>
          </Link>
          <button className="dashboard__sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="dashboard__nav">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `dashboard__nav-item ${isActive ? 'dashboard__nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          {/* Show "New Application" prominently if not logged in? It's already in the list */}
        </nav>

        <div className="dashboard__sidebar-footer">
          {user ? (
            <button onClick={logout} className="dashboard__nav-item dashboard__nav-item--btn">
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          ) : (
            <button onClick={openAuthModal} className="dashboard__nav-item dashboard__nav-item--btn">
              <LogIn size={20} />
              <span>Войти</span>
            </button>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="dashboard__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="dashboard__main">
        <header className="dashboard__header">
          <button className="dashboard__burger" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="dashboard__header-right">
            {user && (
              <button className="dashboard__notification">
                <Bell size={20} />
                <span className="dashboard__notification-dot" />
              </button>
            )}
            
            {user ? (
              <div className="dashboard__avatar">
                {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'USER'}
              </div>
            ) : (
              <button onClick={openAuthModal} className="btn btn-sm btn-primary">
                Войти
              </button>
            )}
          </div>
        </header>

        <div className="dashboard__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
