import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de Páginas 
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

import './assets/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login/Registro */}
        <Route path="/" element={<AuthPage />} />

        {/* Ruta del Perfil de Usuario (Paso 1 del Roadmap) */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Ruta del Dashboard Principal */}
        <Route path="/home" element={<HomePage />} />

        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;