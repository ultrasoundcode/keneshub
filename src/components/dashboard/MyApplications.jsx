import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import './MyApplications.css';

const applications = [
  { id: 1, creditor: 'Kaspi Bank', type: 'Реструктуризация', date: '10.02.2025', status: 'approved', amount: '1 200 000 ₸' },
  { id: 2, creditor: 'Halyk Bank', type: 'Отсрочка платежа', date: '08.02.2025', status: 'pending', amount: '850 000 ₸' },
  { id: 3, creditor: 'МФО «Solva»', type: 'Списание пени', date: '05.02.2025', status: 'pending', amount: '320 000 ₸' },
  { id: 4, creditor: 'Freedom Finance', type: 'Реструктуризация', date: '01.02.2025', status: 'approved', amount: '2 500 000 ₸' },
  { id: 5, creditor: 'Коллектор «Деловой стандарт»', type: 'Досудебное урегулирование', date: '28.01.2025', status: 'action', amount: '450 000 ₸' },
  { id: 6, creditor: 'Forte Bank', type: 'Снижение ставки', date: '20.01.2025', status: 'approved', amount: '3 100 000 ₸' },
  { id: 7, creditor: 'МФО «4Finance»', type: 'Списание пени', date: '15.01.2025', status: 'rejected', amount: '180 000 ₸' },
  { id: 8, creditor: 'Jusan Bank', type: 'Реструктуризация', date: '10.01.2025', status: 'approved', amount: '900 000 ₸' },
];

const statusMap = {
  approved: { text: 'Одобрено', class: 'status--approved' },
  pending: { text: 'На рассмотрении', class: 'status--pending' },
  action: { text: 'Требует действий', class: 'status--action' },
  rejected: { text: 'Отклонено', class: 'status--rejected' },
};

export default function MyApplications() {
  return (
    <div className="my-apps">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="my-apps__title">Мои заявления</h1>
        <p className="my-apps__subtitle">Все ваши обращения к кредиторам</p>

        <div className="my-apps__toolbar">
          <div className="my-apps__search">
            <Search size={18} />
            <input type="text" placeholder="Поиск по кредитору..." />
          </div>
          <button className="btn btn-secondary btn-sm">
            <Filter size={16} /> Фильтр
          </button>
        </div>
      </motion.div>

      <motion.div
        className="my-apps__list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="my-apps__table-wrap">
          <table className="my-apps__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Кредитор</th>
                <th>Тип обращения</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="my-apps__id">{app.id}</td>
                  <td className="my-apps__creditor">{app.creditor}</td>
                  <td>{app.type}</td>
                  <td className="my-apps__amount">{app.amount}</td>
                  <td className="my-apps__date">{app.date}</td>
                  <td>
                    <span className={`my-apps__status ${statusMap[app.status].class}`}>
                      {statusMap[app.status].text}
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
