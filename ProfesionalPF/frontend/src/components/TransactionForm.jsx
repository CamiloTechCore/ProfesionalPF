import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

/**
 * TransactionForm: Registro inteligente de movimientos.
 * Valida la existencia de userId para evitar registros huérfanos.
 */
const TransactionForm = ({ userId, onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  
  const categoriesMap = {
    income: ['Sueldo', 'Honorarios', 'Renta', 'Otros Ingresos'],
    expense: ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación', 'Ocio'],
    saving: ['Fondo de Emergencia', 'Inversión E.A.', 'Ahorro Programado']
  };

  const [formData, setFormData] = useState({
    user_id: userId, // Inicialización primaria
    amount_cop: '',
    transaction_type: 'expense',
    category: 'Vivienda',
    transaction_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // SECCIÓN: SINCRONIZADOR DE IDENTIDAD
  // Si el prop userId cambia (por carga asíncrona en el Home), actualizamos el estado interno
  useEffect(() => {
    if (userId) {
      setFormData(prev => ({ ...prev, user_id: userId }));
    }
  }, [userId]);

  // Efecto para resetear la categoría según el tipo de movimiento
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: categoriesMap[prev.transaction_type][0]
    }));
  }, [formData.transaction_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mantenemos los nombres en minúsculas para coincidir con el esquema DB
    setFormData(prev => ({ ...prev, [name.toLowerCase()]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // GUARDIA 1: Validación de monto
    if (parseFloat(formData.amount_cop) <= 0) {
      return alert("El monto debe ser mayor a cero");
    }

    // GUARDIA 2: Validación de sesión (Evita el error NULL en DB)
    if (!formData.user_id) {
      return alert("Error de sesión: No se detectó ID de usuario. Por favor, reingresa.");
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Enviamos el objeto completo asegurando que user_id no sea nulo
      await axios.post(`${API_URL}/transactions/add`, formData); 
      
      alert("Transacción registrada correctamente");
      
      if (onTransactionAdded) onTransactionAdded();
      
      // Limpiamos campos, pero PRESERVAMOS el user_id para el siguiente registro
      setFormData(prev => ({ 
        ...prev, 
        amount_cop: '', 
        description: '' 
      }));
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
      <h3 className="ppf-title-blue" style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>
        Nuevo Registro Manual
      </h3>
      
      <form className="ppf-form" onSubmit={handleSubmit}>
        {/* TIPO DE MOVIMIENTO */}
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

        {/* VALOR COP */}
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

        {/* CATEGORÍA */}
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

        {/* DESCRIPCIÓN */}
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

        {/* FECHA */}
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

        {/* BOTÓN DINÁMICO */}
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