import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Corregida la importación
import axios from 'axios';

const TransactionForm = ({ userId, onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  
  // Categorías según el Roadmap 4.2
  const categoriesMap = {
    income: ['Sueldo', 'Honorarios', 'Renta', 'Otros Ingresos'],
    expense: ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación', 'Ocio'],
    saving: ['Fondo de Emergencia', 'Inversión E.A.', 'Ahorro Programado']
  };

  const [formData, setFormData] = useState({
    user_id: userId, // Minúsculas para coincidir con DB
    amount_cop: '',
    transaction_type: 'expense',
    category: 'Vivienda',
    transaction_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Efecto para resetear la categoría cuando cambia el tipo de movimiento
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: categoriesMap[prev.transaction_type][0]
    }));
  }, [formData.transaction_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name.toLowerCase()]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.amount_cop) <= 0) return alert("El monto debe ser mayor a cero");

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      // Endpoint corregido según tu estructura de backend
      await axios.post(`${API_URL}/transactions/add`, formData); 
      
      alert("Transacción registrada correctamente");
      
      if (onTransactionAdded) onTransactionAdded(); // Callback para refrescar el Dashboard
      
      // Limpiar solo los campos variables
      setFormData(prev => ({ ...prev, amount_cop: '', description: '' }));
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
            name="transaction_type" 
            className="ppf-input" 
            onChange={handleChange}
            value={formData.transaction_type}
          >
            <option value="income">Ingreso (+)</option>
            <option value="expense">Gasto (-)</option>
            <option value="saving">Ahorro (Investing)</option>
          </select>
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">VALOR EN PESOS (COP)</label>
          <input 
            type="number" 
            name="amount_cop" 
            className="ppf-input" 
            placeholder="0.00" 
            value={formData.amount_cop}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">CATEGORÍA</label>
          <select 
            name="category" 
            className="ppf-input" 
            value={formData.category} 
            onChange={handleChange}
          >
            {categoriesMap[formData.transaction_type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">DESCRIPCIÓN</label>
          <input 
            type="text" 
            name="description" 
            className="ppf-input" 
            placeholder="Ej: Pago de internet" 
            value={formData.description}
            onChange={handleChange}
            maxLength={100}
          />
        </div>

        <div className="ppf-form__group">
          <label className="ppf-label">FECHA</label>
          <input 
            type="date" 
            name="transaction_date" 
            className="ppf-input" 
            value={formData.transaction_date}
            onChange={handleChange}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="ppf-button-primary" 
          disabled={loading}
          style={{ 
            marginTop: '1rem',
            backgroundColor: formData.transaction_type === 'income' ? '#059669' : 
                             formData.transaction_type === 'saving' ? '#7c3aed' : '#dc2626'
          }}
        >
          {loading ? 'Procesando...' : 'Guardar Transacción'}
        </button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;