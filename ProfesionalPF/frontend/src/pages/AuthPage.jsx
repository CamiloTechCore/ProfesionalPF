import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

/**
 * AuthPage: Maneja el ingreso y registro de usuarios para P&PF.
 * Implementa animaciones con Framer Motion y validaciones de Habeas Data.
 */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    FULL_NAME: '',
    EMAIL: '',
    BIRTH_DATE: '',
    PASSWORD: '',
    ACCEPTED_POLICIES: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ruta dinámica desde variables de entorno
    const API_URL = import.meta.env.VITE_API_URL;

    if (!isLogin) {
      try {
        const response = await axios.post(`${API_URL}/users/signup`, formData);
        alert("Registro exitoso: " + response.data.message);
      } catch (error) {
        alert("Error en el registro: " + (error.response?.data?.error || "Servidor no disponible"));
      }
    } else {
      console.log("Iniciando sesión con:", formData.EMAIL);
      // Aquí irá la lógica de login en la Fase 2.2
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: 'var(--ppf-spacing-md)' }}>
      {/* USO DE VARIABLE 'motion': 
          Se utiliza aquí para animar la entrada de la tarjeta principal. 
      */}
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="ppf-card ppf-card--translucent"
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--ppf-spacing-lg)', color: 'var(--ppf-color-primary)' }}>
          {isLogin ? 'Bienvenido a P&PF' : 'Crea tu Cuenta'}
        </h2>

        <form className="ppf-form" onSubmit={handleSubmit}>
          
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                key="register-fields"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ppf-form__group"
              >
                <label className="ppf-label">NOMBRE COMPLETO</label>
                <input 
                  type="text" 
                  name="FULL_NAME"
                  className="ppf-input" 
                  placeholder="Ej. Juan Pérez"
                  maxLength={40}
                  onChange={handleChange}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span className="ppf-text-muted" style={{ fontSize: '10px' }}>Máximo 40 caracteres</span>
                  <span className="ppf-text-muted" style={{ fontSize: '10px' }}>{formData.FULL_NAME.length}/40</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ppf-form__group">
            <label className="ppf-label">CORREO ELECTRÓNICO</label>
            <input 
              type="email" 
              name="EMAIL"
              className="ppf-input" 
              placeholder="correo@ejemplo.com"
              onChange={handleChange}
              required 
            />
          </div>

          {!isLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ppf-form__group"
            >
              <label className="ppf-label">FECHA DE NACIMIENTO</label>
              <input 
                type="date" 
                name="BIRTH_DATE"
                className="ppf-input"
                onChange={handleChange}
                required 
              />
            </motion.div>
          )}

          <div className="ppf-form__group">
            <label className="ppf-label">CONTRASEÑA</label>
            <input 
              type="password" 
              name="PASSWORD"
              className="ppf-input" 
              placeholder="••••••••"
              onChange={handleChange}
              required 
            />
          </div>

          <AnimatePresence>
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ppf-form__group" 
                style={{ flexDirection: 'row', gap: '10px', alignItems: 'flex-start', marginTop: '10px' }}
              >
                <input 
                  type="checkbox" 
                  name="ACCEPTED_POLICIES"
                  style={{ marginTop: '4px' }}
                  onChange={handleChange}
                  required 
                />
                <label className="ppf-text-muted" style={{ fontSize: '11px', lineHeight: '1.2' }}>
                  Acepto el tratamiento de mis datos personales según la <strong>Ley 1581 de 2012 (Habeas Data)</strong>.
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="ppf-button-primary" 
            style={{ marginTop: 'var(--ppf-spacing-md)' }}
          >
            {isLogin ? 'Entrar' : 'Registrarme'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--ppf-spacing-xl)', fontSize: 'var(--ppf-text-sm)' }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--ppf-color-primary)', cursor: 'pointer', marginLeft: '5px', fontWeight: '600' }}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;