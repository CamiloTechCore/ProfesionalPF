import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ FULL_NAME: '', EMAIL: '', PASSWORD: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Lógica de Google: Obtiene el perfil y lo envía al backend 
   */
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${API_URL}/users/google-auth`, {
          EMAIL: userInfo.data.email,
          FULL_NAME: userInfo.data.name,
          GOOGLE_ID: userInfo.data.sub 
        });

        localStorage.setItem('ppf_session', JSON.stringify(response.data.user));
        navigate('/home');
      } catch (error) {
        alert("Error al autenticar con Google. Inténtalo de nuevo.");
      } finally { setLoading(false); }
    },
    onError: () => alert("Error en el inicio de sesión con Google")
  });

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
        alert("¡Registro exitoso! Ya puedes ingresar.");
        setIsLogin(true);
      }
    } catch (error) {
      alert("Error en las credenciales. Revisa tu correo y contraseña.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ppf-auth-layout"> 
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="ppf-card-AuthPage"
      >
        <h2 className="ppf-title-blue" style={{ marginBottom: '0.5rem' }}>
          {isLogin ? 'Bienvenido a P&PF' : 'Crea tu Cuenta'}
        </h2>
        <p className="ppf-text-muted" style={{ marginBottom: '2rem' }}>
          {isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a la mejor gestión financiera'}
        </p>

        {/* Botón de Google con ícono corregido */}
        <button 
          onClick={() => handleGoogleLogin()} 
          className="ppf-button-google" 
          disabled={loading}
          type="button"
        >
          <img 
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
            className="ppf-google-icon" 
            alt="Google Logo" 
          />
          {isLogin ? 'Iniciar sesión con Google' : 'Regístrate con Google'}
        </button>

        <div className="ppf-auth-divider">O</div>

        <form className="ppf-form" onSubmit={handleSubmit}>
          <AnimatePresence mode='wait'>
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="ppf-form__group"
              >
                <label className="ppf-label">Nombre Completo</label>
                <input type="text" name="FULL_NAME" className="ppf-input" placeholder="Ej: Camilo Vera" onChange={handleChange} required={!isLogin} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ppf-form__group">
            <label className="ppf-label">Correo Electrónico</label>
            <input type="email" name="EMAIL" className="ppf-input" placeholder="tu@correo.com" onChange={handleChange} required />
          </div>

          <div className="ppf-form__group">
            <label className="ppf-label">Contraseña</label>
            <input type="password" name="PASSWORD" className="ppf-input" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="ppf-button-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'ENTRAR' : 'REGISTRARME')}
          </button>
        </form>

        <p className="ppf-text-footer" style={{ marginTop: '2rem' }}>
          {isLogin ? '¿No tienes cuenta aún?' : '¿Ya tienes cuenta?'}
          {/* Realce del texto solicitado */}
          <span onClick={() => setIsLogin(!isLogin)} className="ppf-link">
            {isLogin ? ' Regístrate aquí' : ' Inicia sesión'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;