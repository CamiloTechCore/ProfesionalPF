import React, { useState } from 'react';
import axios from 'axios';

/**
 * Componente: SavingsGoal
 * Gestiona múltiples metas de ahorro e inversión con proyecciones de interés compuesto.
 */
const SavingsGoal = ({ goals = [], userId, onGoalUpdated }) => {
  // 1. ESTADOS PARA CONTROL DE MODALES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // 2. ESTADOS PARA CAPTURA DE DATOS
  const [newGoal, setNewGoal] = useState({
    goal_name: '',
    goal_amount: '',
    annual_effective_rate: '',
    investment_type: 'Neo banco'
  });

  const [actionInfo, setActionInfo] = useState({
    metricId: '',
    goalName: '',
    amount: ''
  });

  // --- LÓGICA DE PROYECCIÓN FINANCIERA (EA) ---
  const getProjections = (P, r) => {
    const rate = (parseFloat(r) || 0) / 100;
    // A = P * (1 + r)^t [Fórmula de interés compuesto]
    return { 
      year1: P * Math.pow(1 + rate, 1), 
      year5: P * Math.pow(1 + rate, 5) 
    };
  };

  const getTimeProgress = (createdAt, years) => {
    const start = new Date(createdAt);
    const now = new Date();
    const target = new Date(start);
    target.setFullYear(start.getFullYear() + years);
    
    const total = target - start;
    const elapsed = now - start;
    // Retorna porcentaje de tiempo transcurrido hacia el hito (1 o 5 años)
    return Math.min(Math.max((elapsed / total) * 100, 0), 100).toFixed(1);
  };

  // --- ACCIONES API ---
  const handleSaveGoal = async () => {
    if (!userId) return alert("Error: Sesión no detectada.");
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/savings/set`, {
        user_id: userId,
        ...newGoal,
        goal_amount: parseFloat(newGoal.goal_amount),
        annual_effective_rate: parseFloat(newGoal.annual_effective_rate) || 0,
        monthly_contribution: 0
      });
      setShowAddModal(false);
      onGoalUpdated(); // Refresca el dashboard y el balance
      setNewGoal({ goal_name: '', goal_amount: '', annual_effective_rate: '', investment_type: 'Neo banco' });
    } catch (e) { console.error("Error al crear meta:", e); }
  };

  const handleDeposit = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/savings/deposit`, {
        userId,
        metricId: actionInfo.metricId,
        goalName: actionInfo.goalName,
        amount: parseFloat(actionInfo.amount)
      });
      setShowDepositModal(false);
      onGoalUpdated(); // El balance neto bajará al "invertir" este dinero
      setActionInfo({ metricId: '', goalName: '', amount: '' });
    } catch (e) { console.error("Error al aportar:", e); }
  };

  const handleWithdraw = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/savings/withdraw`, {
        userId,
        metricId: actionInfo.metricId,
        goalName: actionInfo.goalName,
        amount: parseFloat(actionInfo.amount)
      });
      setShowWithdrawModal(false);
      onGoalUpdated(); // El balance neto subirá al "retirar" fondos a disponible
      setActionInfo({ metricId: '', goalName: '', amount: '' });
    } catch (e) { console.error("Error al retirar:", e); }
  };

  return (
    <div className="ppf-card ppf-savings-card-full">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h4 className="ppf-label" style={{ color: '#000' }}>PROYECCIÓN DE INTERÉS COMPUESTO (EA)</h4>
        <button onClick={() => setShowAddModal(true)} className="ppf-button-primary">
          + NUEVA META
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ fontSize: '0.7rem', color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '10px' }}>NOMBRE | TIPO</th>
              <th style={{ padding: '10px' }}>TEA</th>
              <th style={{ padding: '10px' }}>MONTO ACTUAL</th>
              <th style={{ padding: '10px' }}>PROGRESO 1A | FINAL</th>
              <th style={{ padding: '10px' }}>PROGRESO 5A | FINAL</th>
              <th style={{ padding: '10px' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((g) => {
              const { year1, year5 } = getProjections(g.goal_amount, g.annual_effective_rate);
              const prog1 = getTimeProgress(g.updated_at, 1);
              const prog5 = getTimeProgress(g.updated_at, 5);

              return (
                <tr key={g.metric_id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                  <td style={{ padding: '10px' }}>
                    <strong>{g.goal_name}</strong> <br/>
                    <small className="ppf-tag">{g.investment_type}</small>
                  </td>
                  <td style={{ padding: '10px' }}>{g.annual_effective_rate}%</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    ${parseFloat(g.goal_amount).toLocaleString('es-CO')}
                  </td>
                  
                  {/* BARRA DE PROGRESO 1 AÑO (AZUL) */}
                  <td style={{ padding: '10px' }}>
                    <div className="ppf-progress-mini">
                      <div style={{ 
                        width: `${prog1}%`, 
                        backgroundColor: 'var(--ppf-color-primary)' 
                      }} />
                    </div>
                    <small>{prog1}% | $<strong>{year1.toLocaleString(undefined, {maximumFractionDigits:0})}</strong></small>
                  </td>

                  {/* BARRA DE PROGRESO 5 AÑOS (VERDE) */}
                  <td style={{ padding: '10px' }}>
                    <div className="ppf-progress-mini">
                      <div style={{ 
                        width: `${prog5}%`, 
                        backgroundColor: 'var(--ppf-color-ingresos)' 
                      }} />
                    </div>
                    <small>{prog5}% | $<strong>{year5.toLocaleString(undefined, {maximumFractionDigits:0})}</strong></small>
                  </td>

                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => { setActionInfo({ metricId: g.metric_id, goalName: g.goal_name, amount: '' }); setShowDepositModal(true); }}
                        className="ppf-button-primary" style={{ backgroundColor: '#10b981', padding: '4px 8px', fontSize: '0.65rem' }}
                      >APORTAR</button>
                      
                      <button 
                        onClick={() => { setActionInfo({ metricId: g.metric_id, goalName: g.goal_name, amount: '' }); setShowWithdrawModal(true); }}
                        className="ppf-button-primary" style={{ backgroundColor: '#ef4444', padding: '4px 8px', fontSize: '0.65rem' }}
                      >RETIRAR</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL: NUEVA META --- */}
      {showAddModal && (
        <div className="ppf-modal-overlay">
          <div className="ppf-card ppf-modal-content">
            <h3>Configurar Inversión</h3>
            <div className="ppf-form">
              <label className="ppf-label">Nombre de la Meta</label>
              <input className="ppf-input" placeholder="Ej: Carro 2027" onChange={e => setNewGoal({...newGoal, goal_name: e.target.value})} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="ppf-label">Inversión Inicial</label>
                  <input className="ppf-input" type="number" placeholder="Monto COP" onChange={e => setNewGoal({...newGoal, goal_amount: e.target.value})} />
                </div>
                <div>
                  <label className="ppf-label">TEA %</label>
                  <input className="ppf-input" type="number" step="0.1" placeholder="Ej: 13.2" onChange={e => setNewGoal({...newGoal, annual_effective_rate: e.target.value})} />
                </div>
              </div>

              <label className="ppf-label">Tipo de Producto</label>
              <select className="ppf-input" onChange={e => setNewGoal({...newGoal, investment_type: e.target.value})}>
                <option value="Neo banco">Neo banco (Pibank, Lulo, Nu)</option>
                <option value="CDT">CDT (Término Fijo)</option>
              </select>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSaveGoal} className="ppf-button-primary" style={{ flex: 1 }}>GUARDAR</button>
                <button onClick={() => setShowAddModal(false)} className="ppf-button-primary" style={{ flex: 1, backgroundColor: '#6b7280' }}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: APORTAR --- */}
      {showDepositModal && (
        <div className="ppf-modal-overlay">
          <div className="ppf-card ppf-modal-content" style={{ maxWidth: '400px' }}>
            <h3>Aportar a {actionInfo.goalName}</h3>
            <p className="ppf-text-muted" style={{ marginBottom: '1rem' }}>Suma capital a esta inversión.</p>
            <input className="ppf-input" type="number" placeholder="Monto COP" autoFocus onChange={e => setActionInfo({...actionInfo, amount: e.target.value})} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleDeposit} className="ppf-button-primary" style={{ flex: 1, backgroundColor: '#10b981' }}>APORTAR</button>
              <button onClick={() => setShowDepositModal(false)} className="ppf-button-primary" style={{ flex: 1, backgroundColor: '#6b7280' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: RETIRAR --- */}
      {showWithdrawModal && (
        <div className="ppf-modal-overlay">
          <div className="ppf-card ppf-modal-content" style={{ maxWidth: '400px' }}>
            <h3>Retirar de {actionInfo.goalName}</h3>
            <p className="ppf-text-muted" style={{ marginBottom: '1rem' }}>Mueve fondos de tu ahorro a tu saldo disponible.</p>
            <input className="ppf-input" type="number" placeholder="Monto COP" autoFocus onChange={e => setActionInfo({...actionInfo, amount: e.target.value})} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleWithdraw} className="ppf-button-primary" style={{ flex: 1, backgroundColor: '#ef4444' }}>RETIRAR</button>
              <button onClick={() => setShowWithdrawModal(false)} className="ppf-button-primary" style={{ flex: 1, backgroundColor: '#6b7280' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoal;