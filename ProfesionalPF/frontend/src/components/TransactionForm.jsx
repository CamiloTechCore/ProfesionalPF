import React, { useState } from 'react';
//import { motion } from 'framer-motion';
import axios from 'axios';

const TransactionForm = ({ userId, onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    USER_ID: userId,
    AMOUNT_COP: '',
    TRANSACTION_TYPE: 'EXPENSE',
    CATEGORY: 'Vivienda',
    TRANSACTION_DATE: new Date().toISOString().split('T')[0],
    DESCRIPTION: ''
  });

  const categories = {
    INCOME: ['Sueldo', 'Honorarios', 'Renta', 'Otros Ingresos'],
    EXPENSE: ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación', 'Ocio'],
    SAVING: ['Fondo de Emergencia', 'Inversión E.A.', 'Ahorro Programado']
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.AMOUNT_COP <= 0) return alert("El monto debe ser mayor a cero");

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/transactions`, formData);
      alert("Transacción registrada correctamente");
      onTransactionAdded(); // Recarga los saldos en el Dashboard
    } catch (error) {
      alert("Error al registrar: " + (error.response?.data?.error || "Error de red"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="ppf-card ppf-card--translucent"
    >
      <h3 style={{ color: 'var(--ppf-color-primary)', marginBottom: 'var(--ppf-spacing-md)' }}>
        Nuevo Registro Manual
      </h3>
      
      <form className="ppf-form" onSubmit={handleSubmit}>
        <div className="ppf-form__group">
          <label className="ppf-label">TIPO DE MOVIMIENTO</label>
          <select 
            name="TRANSACTION_TYPE" 
            className="ppf-input" 
            onChange={handleChange}
            value={formData.TRANSACTION_TYPE}
          >
            <option value="INCOME">Ingreso (+)</option>
            <option value="EXPENSE">Gasto (-)</option>
            <option value="SAVING">Ahorro (Investing)</option>
          </select>
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">VALOR EN PESOS (COP)</label>
          <input 
            type="number" 
            name="AMOUNT_COP" 
            className="ppf-input" 
            placeholder="0.00" 
            onChange={handleChange}
            required 
          />
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">CATEGORÍA</label>
          <select name="CATEGORY" className="ppf-input" onChange={handleChange}>
            {categories[formData.TRANSACTION_TYPE].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">FECHA</label>
          <input 
            type="date" 
            name="TRANSACTION_DATE" 
            className="ppf-input" 
            value={formData.TRANSACTION_DATE}
            onChange={handleChange}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="ppf-button-primary" 
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Guardar Transacción'}
        </button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;