import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavingsGoal = ({ goalData, userId, onGoalUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(goalData?.goal_amount || '');

  useEffect(() => {
    if (goalData?.goal_amount) setNewGoal(goalData.goal_amount);
  }, [goalData]);

  const handleSave = async () => {
    // Trazas de depuración para consola
    console.log("Intentando guardar meta con:", { userId, newGoal });

    if (!userId) return alert("Error: Sesión de usuario no detectada.");
    if (!newGoal || parseFloat(newGoal) <= 0) return alert("Monto de meta inválido.");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // EL CAMBIO CRÍTICO: Usamos user_id y goal_amount
      await axios.post(`${API_URL}/savings/set`, {
        user_id: userId,        // Debe ser snake_case para la DB
        goal_amount: parseFloat(newGoal) 
      });

      setIsEditing(false);
      if (onGoalUpdated) onGoalUpdated();
      alert("¡Meta de ahorro guardada!");
    } catch (error) {
      // Captura el error 500 de la base de datos
      console.error("Error al guardar meta:", error.response?.data);
      alert("Error: " + (error.response?.data?.error || "No se pudo guardar la meta"));
    }
  };

  return (
    <div className="ppf-card" style={{ textAlign: 'left', minHeight: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 className="ppf-label" style={{ color: '#000', margin: 0 }}>Meta de Ahorro Activa</h4>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="ppf-text-muted" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          {isEditing ? 'Cancelar' : (goalData?.is_active ? 'Editar Meta' : 'Configurar')}
        </button>
      </div>

      {isEditing ? (
        <div className="ppf-form">
          <label className="ppf-label">MONTO DEL OBJETIVO (COP)</label>
          <input 
            type="number" 
            className="ppf-input" 
            value={newGoal} 
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Ej: 5000000"
            autoFocus
          />
          <button onClick={handleSave} className="ppf-button-primary" style={{ marginTop: '10px' }}>
            Guardar Objetivo
          </button>
        </div>
      ) : (
        <>
          {goalData?.is_active ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Progreso</span>
                <span style={{ fontWeight: 'bold', color: 'var(--ppf-color-primary)' }}>{goalData.progress_percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${goalData.progress_percentage}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--ppf-color-primary)',
                  transition: 'width 0.8s ease-in-out'
                }} />
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                Meta Final: <strong>${parseFloat(goalData.goal_amount).toLocaleString('es-CO')}</strong>
              </p>
            </>
          ) : (
            <div className="ppf-empty-state" style={{ padding: '20px 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                No tienes metas configuradas aún.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavingsGoal;