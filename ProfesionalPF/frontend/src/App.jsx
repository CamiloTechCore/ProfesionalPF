import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import './assets/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login/Registro */}
        <Route path="/" element={<AuthPage />} />
        
        {/* RUTA HOME: Aquí es donde el navegador debe encontrar el componente */}
        <Route path="/home" element={<HomePage />} />

        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;