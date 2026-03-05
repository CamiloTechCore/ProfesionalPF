import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FULL_NAME: '',
    EMAIL: '',
    BIRTH_DATE: '',
    PASSWORD: '',
    ACCEPTED_POLICIES: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      if (!isLogin) {
        const response = await axios.post(`${API_URL}/users/signup`, formData);
        alert(response.data.message);
      } else {
        alert("Lógica de Login (Fase 3.3) en proceso de validación de hash...");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "Servidor no disponible"));
    } finally { setLoading(false); }
  };

  // Autenticación Social (Fase 3.3)
  const handleGoogleLogin = () => {
    alert("Redirigiendo a Google OAuth 2.0...");
    // Aquí se integra supabase.auth.signInWithOAuth({ provider: 'google' })
  };

  return (
    <div className="ppf-auth-layout"> 
      {/* Clase CSS con width: 200% y min-height: 1vh definida en global.css */}
      
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="ppf-card ppf-card--translucent"
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <h2 style={{ textAlign: 'center', color: 'var(--ppf-color-primary)', marginBottom: '1.5rem' }}>
          {isLogin ? 'Bienvenido a P&PF' : 'Crea tu Cuenta'}
        </h2>

        <form className="ppf-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="ppf-form__group">
              <label className="ppf-label">Nombre Completo</label>
              <input type="text" name="FULL_NAME" className="ppf-input" onChange={handleChange} required />
            </div>
          )}

          <div className="ppf-form__group" style={{ marginTop: '1rem' }}>
            <label className="ppf-label">Correo Electrónico</label>
            <input type="email" name="EMAIL" className="ppf-input" onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="ppf-form__group" style={{ marginTop: '1rem' }}>
              <label className="ppf-label">Fecha de Nacimiento</label>
              <input type="date" name="BIRTH_DATE" className="ppf-input" onChange={handleChange} required />
            </div>
          )}

          <div className="ppf-form__group" style={{ marginTop: '1rem' }}>
            <label className="ppf-label">Contraseña</label>
            <input type="password" name="PASSWORD" className="ppf-input" onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'flex-start' }}>
              <input type="checkbox" name="ACCEPTED_POLICIES" onChange={handleChange} required />
              <label className="ppf-text-muted" style={{ fontSize: '11px' }}>
                Acepto el tratamiento de datos según la <strong>Ley 1581 de 2012 (Habeas Data)</strong>.
              </label>
            </div>
          )}

          <button type="submit" className="ppf-button-primary" style={{ marginTop: '20px' }} disabled={loading}>
            {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarme')}
          </button>
        </form>

        {/* Divisor Social (Fase 3.3) */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <hr style={{ flex: 1, border: '0.1px solid var(--ppf-color-border)' }} />
          <span style={{ margin: '0 10px', fontSize: '10px', color: 'var(--ppf-color-text-muted)' }}>O</span>
          <hr style={{ flex: 1, border: '0.1px solid var(--ppf-color-border)' }} />
        </div>

        <button onClick={handleGoogleLogin} className="ppf-input" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#fff' }}>
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="18" alt="G" />
          Continuar con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'black' }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--ppf-color-primary)', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}>
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;