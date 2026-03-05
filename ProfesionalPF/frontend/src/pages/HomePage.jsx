import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import CategoryChart from '../components/CategoryChart';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [financials, setFinancials] = useState({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const [resBalance, resSummary] = await Promise.all([
        axios.get(`${API_URL}/transactions/balance/${user.id}`),
        axios.get(`${API_URL}/transactions/summary/${user.id}`)
      ]);
      setFinancials({
        income: resBalance.data.total_income || 0,
        expense: resBalance.data.total_expense || 0,
        balance: resBalance.data.net_balance || 0
      });
      setChartData(resSummary.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const session = localStorage.getItem('ppf_session');
    if (!session) navigate('/');
    else setUser(JSON.parse(session));
  }, [navigate]);

  useEffect(() => { if (user) fetchData(); }, [user]);

  return (
    <div className="ppf-app-container">
      <div className="ppf-main-content">
        <header className="ppf-header">
          <h1 className="ppf-title-blue">P&PF | Finances</h1>
            <p className="ppf-welcome-message">Bienvenido, {user?.name}</p>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="ppf-button-primary">Salir</button>
        </header>

        <div className="ppf-dashboard-grid">
          <div className="ppf-card ppf-card--income">
            <p className="ppf-label">Total Ingresos</p>
            <h2>${financials.income.toLocaleString('es-CO')}</h2>
          </div>

          <div className="ppf-card ppf-card--expense">
            <p className="ppf-label">Total Gastos</p>
            <h2>${financials.expense.toLocaleString('es-CO')}</h2>
          </div>

          <div className="ppf-card ppf-card--balance">
            <p className="ppf-label">Balance Neto</p>
            <h2>${financials.balance.toLocaleString('es-CO')}</h2>
          </div>
        </div>

        <div className="ppf-dashboard-grid ppf-dashboard-grid--split">
          <CategoryChart data={chartData} />
          <TransactionForm userId={user?.id} onTransactionAdded={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;