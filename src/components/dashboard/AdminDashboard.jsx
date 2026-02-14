import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, CheckCircle, Clock, AlertCircle, 
  Search, Filter, ChevronDown, Mail, Send, X, Loader2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const API_URL = 'http://localhost:3001';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('keneshab_token');
      const res = await fetch(`${API_URL}/api/admin/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage) return;
    setSending(true);
    try {
      const token = localStorage.getItem('keneshab_token');
      const res = await fetch(`${API_URL}/api/admin/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          message: replyMessage,
          status: replyStatus || undefined
        })
      });
      
      if (res.ok) {
        // Update local state
        setApplications(apps => apps.map(app => 
          app.id === selectedApp.id 
            ? { ...app, status: replyStatus || app.status } 
            : app
        ));
        setSelectedApp(null);
        setReplyMessage('');
        setReplyStatus('');
        alert('Ответ успешно отправлен');
      } else {
        alert('Ошибка при отправке');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке');
    } finally {
      setSending(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.creditor_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.contract_number?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'action': return 'warning';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'action': return 'Требует действий';
      default: return 'На рассмотрении';
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Админ-центр</h1>
          <p>Управление заявлениями пользователей</p>
        </div>
        <div className="admin-stats">
          <div className="admin-stat-card">
            <Users size={20} />
            <div>
              <span>Всего</span>
              <strong>{applications.length}</strong>
            </div>
          </div>
          <div className="admin-stat-card warning">
            <Clock size={20} />
            <div>
              <span>Ожидают</span>
              <strong>{applications.filter(a => a.status === 'pending').length}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-controls">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Поиск по имени, банку или договору..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'rejected', 'action'].map(f => (
            <button 
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Все' : getStatusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="applications-table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Заявитель</th>
              <th>Кредитор</th>
              <th>Тип</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id} onClick={() => setSelectedApp(app)}>
                <td>
                  <div className="applicant-info">
                    <strong>{app.user_name || 'Аноним'}</strong>
                    <span>{app.user_email}</span>
                  </div>
                </td>
                <td>{app.creditor_name}</td>
                <td>{app.request_type}</td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                </td>
                <td><ChevronDown size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApps.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <p>Заявлений не найдено</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApp(null)}
          >
            <motion.div 
              className="admin-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedApp(null)}>
                <X size={24} />
              </button>
              
              <div className="modal-header">
                <h2>Заявление от {selectedApp.user_name}</h2>
                <span className={`status-badge ${getStatusColor(selectedApp.status)}`}>
                  {getStatusLabel(selectedApp.status)}
                </span>
              </div>

              <div className="modal-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Кредитор</label>
                    <p>{selectedApp.creditor_name} ({selectedApp.creditor_type})</p>
                  </div>
                  <div className="info-item">
                    <label>Договор</label>
                    <p>{selectedApp.contract_number}</p>
                  </div>
                  <div className="info-item">
                    <label>Долг</label>
                    <p>{selectedApp.debt_amount?.toLocaleString()} ₸</p>
                  </div>
                  <div className="info-item">
                    <label>Доход</label>
                    <p>{selectedApp.monthly_income?.toLocaleString()} ₸</p>
                  </div>
                </div>

                <div className="description-box">
                  <label>Ситуация заявителя:</label>
                  <p>{selectedApp.description || 'Не указано'}</p>
                </div>

                <div className="reply-section">
                  <h3><Mail size={18} /> Ответить пользователю</h3>
                  <div className="status-select">
                    <label>Изменить статус на:</label>
                    <select value={replyStatus} onChange={e => setReplyStatus(e.target.value)}>
                      <option value="">Не менять</option>
                      <option value="pending">На рассмотрении</option>
                      <option value="action">Требует действий</option>
                      <option value="approved">Одобрено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Введите текст ответа..."
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    rows={4}
                  />
                  <button 
                    className="reply-btn" 
                    onClick={handleReply}
                    disabled={!replyMessage || sending}
                  >
                    {sending ? <Loader2 className="spin" /> : <Send size={18} />}
                    Отправить ответ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
