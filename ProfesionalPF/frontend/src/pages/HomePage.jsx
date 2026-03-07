import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Componentes del Ecosistema P&PF
import TransactionForm from '../components/TransactionForm';
import CategoryChart from '../components/CategoryChart';
import TransactionList from '../components/TransactionList';
import SavingsGoal from '../components/SavingsGoal';

const HomePage = () => {
  const navigate = useNavigate();
  
  // ESTADOS PRINCIPALES
  const [user, setUser] = useState(null);
  const [financials, setFinancials] = useState({ income: 0, expenses: 0, balance: 0 });
  const [trm, setTrm] = useState(4000); 
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]); 
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false); // 🚩 Estado para el banner

  const totalSaved = savingsGoals.reduce((acc, goal) => 
    acc + (parseFloat(goal.goal_amount) || 0), 0
  );

  /**
   * SECCIÓN: CARGA DE DATOS SINCRONIZADA
   */
  const fetchData = async () => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const [resBalance, resTrm, resSummary, resHistory, resGoal, resProfile] = await Promise.all([
        axios.get(`${API_URL}/transactions/balance/${user.id}`),
        axios.get(`${API_URL}/config/trm`).catch(() => ({ data: { trm: 4000 } })),
        axios.get(`${API_URL}/transactions/summary/${user.id}`),
        axios.get(`${API_URL}/transactions/history/${user.id}`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/savings/goal/${user.id}`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/users/profile/${user.id}`) // 🚩 Verificamos el perfil [cite: 9]
      ]);

      setFinancials({
        income: resBalance.data.total_income || 0,
        expenses: resBalance.data.total_expenses || 0,
        balance: resBalance.data.net_balance || 0
      });
      
      setTrm(resTrm.data.trm || 4000);
      setChartData(resSummary.data || []);
      setTransactions(resHistory.data || []);
      setSavingsGoals(resGoal.data || []);
      
      // Si no hay birth_date, activamos el aviso [cite: 10, 11]
      if (!resProfile.data.birth_date) {
        setIsProfileIncomplete(true);
      } else {
        setIsProfileIncomplete(false);
      }

    } catch (err) { 
      console.error("Error de sincronización:", err);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(29, 78, 216);
    doc.text("P&PF | Reporte Financiero Profesional", 14, 20);
    
    autoTable(doc, {
      startY: 40,
      head: [['Concepto', 'Pesos (COP)', 'Dólares (USD)']],
      body: [
        ['Total Ingresos', `$${financials.income.toLocaleString()}`, `$${(financials.income / trm).toFixed(2)}`],
        ['Total Gastos', `$${financials.expenses.toLocaleString()}`, `$${(financials.expenses / trm).toFixed(2)}`],
        ['Total Ahorrado', `$${totalSaved.toLocaleString()}`, `$${(totalSaved / trm).toFixed(2)}`],
        ['Balance Neto', `$${financials.balance.toLocaleString()}`, `$${(financials.balance / trm).toFixed(2)}`],
      ],
      headStyles: { fillColor: [29, 78, 216] }
    });

    doc.save(`Reporte_PF_${user?.name}.pdf`);
  };

  useEffect(() => {
    const session = localStorage.getItem('ppf_session');
    if (!session) navigate('/');
    else setUser(JSON.parse(session));
  }, [navigate]);

  useEffect(() => { 
    if (user) fetchData(); 
  }, [user]);

  return (
    <div className="ppf-app-container">
      <div className="ppf-main-content">
        
        {/* CABECERA PRINCIPAL */}
        <header className="ppf-header">
          <div>
            <h1 className="ppf-title-blue">P&PF | Finances</h1>
            <p className="ppf-welcome-message">Bienvenido, <strong>{user?.name}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={() => navigate('/profile')} className="ppf-button-primary" style={{ backgroundColor: '#6366f1' }}>
              MI PERFIL
            </button>
            <button onClick={downloadPDF} className="ppf-button-primary" style={{ backgroundColor: '#10b981' }}>
              PDF
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/'); }} className="ppf-button-primary" style={{ backgroundColor: '#ef4444' }}>
              SALIR
            </button>
          </div>
        </header>

        {isProfileIncomplete && (
          <div className="ppf-alert-warning" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', borderLeft: '5px solid #f59e0b', backgroundColor: '#fffbeb' }}>
            ⚠️ <strong>Perfil Incompleto:</strong> Por favor registra tu fecha de nacimiento para habilitar proyecciones financieras exactas. <u style={{ color: '#b45309' }}>Completar ahora</u>
          </div>
        )}

        {/* 1. TARJETAS DE RESUMEN */}
        <div className="ppf-dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="ppf-card ppf-card--income">
            <p className="ppf-label">TOTAL INGRESOS</p>
            <h2>${financials.income.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.income / trm).toFixed(2)} USD</p>
          </div>

          <div className="ppf-card ppf-card--expense">
            <p className="ppf-label">TOTAL GASTOS</p>
            <h2>${financials.expenses.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.expenses / trm).toFixed(2)} USD</p>
          </div>

          <div className="ppf-card ppf-card--saving">
            <p className="ppf-label">VALORES AHORRADOS</p>
            <h2 style={{ color: 'var(--ppf-color-saving)' }}>
              ${totalSaved.toLocaleString('es-CO')}
            </h2>
            <p className="ppf-text-muted">≈ ${(totalSaved / trm).toFixed(2)} USD</p>
          </div>

          <div className="ppf-card ppf-card--balance">
            <p className="ppf-label">BALANCE NETO</p>
            <h2>${financials.balance.toLocaleString('es-CO')}</h2>
            <p className="ppf-text-muted">≈ ${(financials.balance / trm).toFixed(2)} USD</p>
          </div>
        </div>

        {/* 2. FILA INTERMEDIA: Gráfica y Formulario */}
        <div className="ppf-dashboard-grid ppf-dashboard-grid--split">
          <CategoryChart data={chartData} />
          <TransactionForm userId={user?.id} onTransactionAdded={fetchData} />
        </div>

        {/* 3. FILA DE METAS */}
        <div className="ppf-dashboard-grid">
          <div className="ppf-savings-card-full">
            <SavingsGoal 
              goals={savingsGoals} 
              userId={user?.id} 
              onGoalUpdated={fetchData} 
            />
          </div>
        </div>

        {/* 4. HISTORIAL DE MOVIMIENTOS */}
        <TransactionList transactions={transactions} />

      </div>
    </div>
  );
};

export default HomePage;