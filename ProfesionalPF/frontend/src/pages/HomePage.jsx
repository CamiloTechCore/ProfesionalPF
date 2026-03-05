import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';

/**
 * HomePage: Centro de mando financiero P&PF.
 * Implementa Motores 4.1, 4.2, 4.3 y 4.4 del Roadmap.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [trm, setTrm] = useState({ valor: 4000, tendencia: 'ESTABLE' }); // Fallback inicial
  const [projections, setProjections] = useState({ fiveYears: 0, tenYears: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Cargar sesión y validar acceso
  useEffect(() => {
    const session = localStorage.getItem('ppf_session');
    if (!session) {
      navigate('/');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  // 2. Motor de Datos: Balance, TRM y Proyecciones
  const fetchFinancialData = async () => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      // 4.2 Motor de Saldos: Obtenemos el neto desde la tabla transactions
      const resBalance = await axios.get(`${API_URL}/transactions/balance/${user.id}`);
      const netBalance = parseFloat(resBalance.data.net_balance) || 0;
      setBalance(netBalance);

      // 4.3 Motor de TRM: Sincronización con API
      try {
        const resTrm = await axios.get(`${API_URL}/config/trm`);
        if (resTrm.data.trm > 0) {
          setTrm({ valor: resTrm.data.trm, tendencia: resTrm.data.tendencia });
        }
      } catch (e) {
        console.warn("Usando TRM de respaldo debido a error en API.");
      }

      // 4.4 Algoritmo de Proyección: Valor Futuro
      // Definimos variables base: P (Ahorro mensual), i (Tasa 1% mensual), n (meses)
      const P = 500000; // Supuesto de ahorro mensual de $500k
      const i = 0.01;   // Tasa del 1%
      
      const calcVF = (months) => netBalance + (P * ((Math.pow(1 + i, months) - 1) / i));
      
      setProjections({
        fiveYears: calcVF(60),
        tenYears: calcVF(120)
      });

    } catch (err) {
      console.error("Error en el Motor Financiero:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchFinancialData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('ppf_session');
    navigate('/');
  };

  if (!user || loading) return <div className="ppf-auth-layout">Cargando motores financieros...</div>;

  return (
    <div className="ppf-main-wrapper" style={{ justifyContent: 'flex-start', paddingTop: '3rem' }}>
      
      {/* HEADER DINÁMICO */}
      <header style={{ width: '100%', maxWidth: '1200px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ color: 'var(--ppf-color-primary)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>P&PF | Finances</h1>
          <p className="ppf-text-muted">Hola, <strong>{user.name}</strong> | Gestión en tiempo real</p>
        </div>
        <button onClick={handleLogout} className="ppf-text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Cerrar Sesión
        </button>
      </header>

      {/* GRID DE CONTROL */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem', 
        width: '100%', 
        maxWidth: '1200px' 
      }}>
        
        {/* COLUMNA 1: ESTADO ACTUAL (4.2 y 4.3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="ppf-card">
            <h4 className="ppf-label">BALANCE NETO (COP)</h4>
            <h2 style={{ fontSize: '2.8rem', margin: '1rem 0', fontWeight: '800' }}>
              ${balance.toLocaleString('es-CO')}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ppf-color-border)', paddingTop: '1rem' }}>
              <p className="ppf-text-muted" style={{ fontSize: '1.1rem' }}>
                ≈ <strong>${(trm.valor > 0 ? (balance / trm.valor).toFixed(2) : 0)} USD</strong>
              </p>
              <span style={{ 
                fontSize: '0.8rem', 
                padding: '4px 8px', 
                borderRadius: '4px',
                background: trm.tendencia === 'ALZA' ? '#dcfce7' : '#fee2e2',
                color: trm.tendencia === 'ALZA' ? '#166534' : '#991b1b'
              }}>
                {trm.tendencia === 'ALZA' ? '↑' : '↓'} TRM: ${trm.valor}
              </span>
            </div>
          </div>

          {/* COLUMNA 2: PROYECCIÓN (4.4) */}
          <div className="ppf-card" style={{ background: 'linear-gradient(145deg, #ffffff, #f1f5f9)' }}>
            <h4 className="ppf-label">VALOR FUTURO PROYECTADO</h4>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p className="ppf-text-muted" style={{ fontSize: '0.8rem' }}>Meta a 5 años (Ahorro + Interés):</p>
                <h3 style={{ color: '#059669', fontSize: '1.6rem' }}>${projections.fiveYears.toLocaleString('es-CO')}</h3>
              </div>
              <div>
                <p className="ppf-text-muted" style={{ fontSize: '0.8rem' }}>Meta a 10 años:</p>
                <h3 style={{ color: 'var(--ppf-color-primary)', fontSize: '1.6rem' }}>${projections.tenYears.toLocaleString('es-CO')}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: REGISTRO (4.2) */}
        <TransactionForm userId={user.id} onTransactionAdded={fetchFinancialData} />

      </div>

      {/* FOOTER DE ESTADO */}
      <footer style={{ marginTop: 'auto', padding: '3rem 0', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '8px 16px', borderRadius: '20px', boxShadow: 'var(--ppf-shadow-lg)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
          <span className="ppf-text-muted" style={{ fontSize: '0.8rem' }}>Servidor: <strong>Online</strong> | Database: <strong>Connected</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;