import { motion } from 'framer-motion';
import { FileText, FilePlus, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardHome.css';

const stats = [
  { icon: FileText, label: 'Всего заявлений', value: '12', color: '#00d4ff' },
  { icon: CheckCircle, label: 'Одобрено', value: '8', color: '#10b981' },
  { icon: Clock, label: 'На рассмотрении', value: '3', color: '#f59e0b' },
  { icon: AlertCircle, label: 'Требует действий', value: '1', color: '#ef4444' },
];

const recentApplications = [
  { id: 1, creditor: 'Kaspi Bank', type: 'Реструктуризация', date: '10.02.2025', status: 'approved' },
  { id: 2, creditor: 'Halyk Bank', type: 'Отсрочка платежа', date: '08.02.2025', status: 'pending' },
  { id: 3, creditor: 'МФО «Solva»', type: 'Списание пени', date: '05.02.2025', status: 'pending' },
  { id: 4, creditor: 'Freedom Finance', type: 'Реструктуризация', date: '01.02.2025', status: 'approved' },
  { id: 5, creditor: 'Коллектор «Деловой стандарт»', type: 'Досудебное урегулирование', date: '28.01.2025', status: 'action' },
];

const statusLabels = {
  approved: { text: 'Одобрено', className: 'status--approved' },
  pending: { text: 'На рассмотрении', className: 'status--pending' },
  action: { text: 'Требует действий', className: 'status--action' },
};

export default function DashboardHome() {
  return (
    <div className="dash-home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dash-home__header">
          <div>
            <h1 className="dash-home__title">Добро пожаловать 👋</h1>
            <p className="dash-home__subtitle">Вот обзор ваших обращений</p>
          </div>
          <Link to="/dashboard/new" className="btn btn-primary">
            <FilePlus size={18} />
            Новое заявление
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="dash-home__stats">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="dash-home__stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="dash-home__stat-icon" style={{ '--stat-color': stat.color }}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="dash-home__stat-value">{stat.value}</p>
              <p className="dash-home__stat-label">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent */}
      <motion.div
        className="dash-home__recent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="dash-home__recent-header">
          <h2>Последние обращения</h2>
          <Link to="/dashboard/applications" className="dash-home__view-all">
            Посмотреть все →
          </Link>
        </div>
        <div className="dash-home__table-wrap">
          <table className="dash-home__table">
            <thead>
              <tr>
                <th>Кредитор</th>
                <th>Тип обращения</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id}>
                  <td className="dash-home__creditor">{app.creditor}</td>
                  <td>{app.type}</td>
                  <td className="dash-home__date">{app.date}</td>
                  <td>
                    <span className={`dash-home__status ${statusLabels[app.status].className}`}>
                      {statusLabels[app.status].text}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
