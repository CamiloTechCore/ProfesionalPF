/* SECCIÓN: PÁGINA PRINCIPAL RESPONSIVA [cite: 79, 81] */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import CategoryChart from '../components/CategoryChart';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [financials, setFinancials] = useState({ income: 0, expense: 0, balance: 0 });
  const [trm, setTrm] = useState(4000);
  const [chartData, setChartData] = useState([]);

  /* SECCIÓN: CARGA DE DATOS [cite: 86, 87] */
  const fetchData = async () => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const [resBalance, resTrm, resSummary] = await Promise.all([
        axios.get(`${API_URL}/transactions/balance/${user.id}`),
        axios.get(`${API_URL}/config/trm`).catch(() => ({ data: { trm: 4000 } })),
        axios.get(`${API_URL}/transactions/summary/${user.id}`)
      ]);

      setFinancials({
        income: resBalance.data.total_income || 0,
        expense: resBalance.data.total_expense || 0,
        balance: resBalance.data.net_balance || 0
      });
      setTrm(resTrm.data.trm || 4000);
      setChartData(resSummary.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const session = localStorage.getItem('ppf_session');
    if (!session) navigate('/');
    else setUser(JSON.parse(session));
  }, [navigate]);

  useEffect(() => { if (user) fetchData(); }, [user]);

  /* SECCIÓN: RENDERIZADO (Contenedor Maestro) [cite: 99] */
  return (
    <div className="ppf-app-container">
      <div className="ppf-main-content">
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="ppf-title-blue" style={{fontSize: '2.4rem'}}>P&PF | Finances</h1>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="ppf-button-primary" style={{padding: '10px 20px'}}>Salir</button>
        </header>

        {/* SECCIÓN: TARJETAS DE RESUMEN (Ingresos, Gastos, Balance) */}
        <div className="ppf-dashboard-grid">
          <div className="ppf-card" style={{ borderTop: '5px solid var(--ppf-color-ingresos)' }}>
            <p className="ppf-label">Total Ingresos</p>
            <h2 style={{ fontSize: '2rem' }}>${financials.income.toLocaleString('es-CO')}</h2>
            <p style={{ color: '#000', fontSize: '0.9rem' }}>≈ ${(financials.income / trm).toFixed(2)} USD</p>
          </div>

          <div className="ppf-card" style={{ borderTop: '5px solid var(--ppf-color-gastos)' }}>
            <p className="ppf-label">Total Gastos</p>
            <h2 style={{ fontSize: '2rem' }}>${financials.expense.toLocaleString('es-CO')}</h2>
            <p style={{ color: '#000', fontSize: '0.9rem' }}>≈ ${(financials.expense / trm).toFixed(2)} USD</p>
          </div>

          <div className="ppf-card" style={{ borderTop: '5px solid var(--ppf-color-primary)' }}>
            <p className="ppf-label">Balance Neto</p>
            <h2 style={{ fontSize: '2.5rem' }}>${financials.balance.toLocaleString('es-CO')}</h2>
            <p style={{ color: '#000', fontSize: '0.9rem' }}>TRM Actual: ${trm}</p>
          </div>
        </div>

        {/* SECCIÓN: GRÁFICA Y REGISTRO [cite: 101, 106] */}
        <div className="ppf-dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          <CategoryChart data={chartData} />
          <TransactionForm userId={user?.id} onTransactionAdded={fetchData} />
        </div>

      </div>
    </div>
  );
};

export default HomePage;