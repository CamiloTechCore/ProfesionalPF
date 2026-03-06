import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import TransactionForm from '../components/TransactionForm';
import CategoryChart from '../components/CategoryChart';
import TransactionList from '../components/TransactionList';
import SavingsGoal from '../components/SavingsGoal';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [financials, setFinancials] = useState({ income: 0, expenses: 0, balance: 0 });
  const [trm, setTrm] = useState(4000); 
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState({ is_active: false });

  const fetchData = async () => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const [resBalance, resTrm, resSummary, resHistory, resGoal] = await Promise.all([
        axios.get(`${API_URL}/transactions/balance/${user.id}`),
        axios.get(`${API_URL}/config/trm`).catch(() => ({ data: { trm: 4000 } })),
        axios.get(`${API_URL}/transactions/summary/${user.id}`),
        axios.get(`${API_URL}/transactions/history/${user.id}`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/savings/goal/${user.id}`).catch(() => ({ data: { is_active: false } }))
      ]);

      setFinancials({
        income: resBalance.data.total_income || 0,
        expenses: resBalance.data.total_expenses || 0,
        balance: resBalance.data.net_balance || 0
      });
      setTrm(resTrm.data.trm || 4000);
      setChartData(resSummary.data || []);
      setTransactions(resHistory.data || []);
      setSavingsGoal(resGoal.data);
    } catch (err) { 
      console.error("Error al sincronizar dashboard:", err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(29, 78, 216);
    doc.text("P&PF | Reporte Financiero", 14, 20);
    
    autoTable(doc, {
      startY: 40,
      head: [['Concepto', 'Pesos (COP)', 'Dólares (USD)']],
      body: [
        ['Total Ingresos', `$${financials.income.toLocaleString()}`, `$${(financials.income / trm).toFixed(2)}`],
        ['Total Gastos', `$${financials.expenses.toLocaleString()}`, `$${(financials.expenses / trm).toFixed(2)}`],
        ['Balance Neto', `$${financials.balance.toLocaleString()}`, `$${(financials.balance / trm).toFixed(2)}`],
      ],
      headStyles: { fillColor: [29, 78, 216] }
    });

    doc.save(`Reporte_P&PF_${user?.name}.pdf`);
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
          <div>
            <h1 className="ppf-title-blue">P&PF | Finances</h1>
            <p className="ppf-welcome-message">Bienvenido, <strong>{user?.name}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={downloadPDF} className="ppf-button-primary" style={{ backgroundColor: '#10b981' }}>
              DESCARGAR PDF
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/'); }} className="ppf-button-primary" style={{ backgroundColor: '#112fb4' }}>
              SALIR
            </button>
          </div>
        </header>

        <div className="ppf-dashboard-grid">
          <div className="ppf-card ppf-card--income">
            <p className="ppf-label">Total Ingresos</p>
            <h2>${financials.income.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.income / trm).toFixed(2)} USD</p>
          </div>
          <div className="ppf-card ppf-card--expense">
            <p className="ppf-label">Total Gastos</p>
            <h2>${financials.expenses.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.expenses / trm).toFixed(2)} USD</p>
          </div>
          <div className="ppf-card ppf-card--balance">
            <p className="ppf-label">Balance Neto</p>
            <h2>${financials.balance.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.balance / trm).toFixed(2)} USD</p>
          </div>
        </div>

        <div className="ppf-dashboard-grid ppf-dashboard-grid--split">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <CategoryChart data={chartData} />
            {/* Se pasan userId y onGoalUpdated para sincronizar */}
            <SavingsGoal 
              goalData={savingsGoal} 
              userId={user?.id} 
              onGoalUpdated={fetchData} 
            />
          </div>
          <TransactionForm userId={user?.id} onTransactionAdded={fetchData} />
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default HomePage;