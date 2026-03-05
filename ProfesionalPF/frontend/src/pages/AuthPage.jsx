import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
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
      const endpoint = isLogin ? '/users/login' : '/users/signup';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('ppf_session', JSON.stringify(response.data.user));
        navigate('/home');
      } else {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Detalle del error Axios:", error);
      alert("Error en la autenticación.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="ppf-auth-layout"> 
      <motion.div layout className="ppf-card ppf-card--translucent">
        <h2 className="ppf-title-blue">
          {isLogin ? 'Bienvenido a P&PF' : 'Crea tu Cuenta'}
        </h2>

        <form className="ppf-form" onSubmit={handleSubmit}>
          <AnimatePresence mode='wait'>
            {!isLogin && (
              <motion.div className="ppf-form__group">
                <label className="ppf-label">Nombre Completo</label>
                <input type="text" name="FULL_NAME" className="ppf-input" onChange={handleChange} required={!isLogin} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ppf-form__group">
            <label className="ppf-label">Correo Electrónico</label>
            <input type="email" name="EMAIL" className="ppf-input" onChange={handleChange} required />
          </div>

          <div className="ppf-form__group">
            <label className="ppf-label">Contraseña</label>
            <input type="password" name="PASSWORD" className="ppf-input" onChange={handleChange} required />
          </div>

          <button type="submit" className="ppf-button-primary" disabled={loading}>
            {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarme')}
          </button>
        </form>

        <p className="ppf-text-footer">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <span onClick={() => setIsLogin(!isLogin)} className="ppf-link">
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;