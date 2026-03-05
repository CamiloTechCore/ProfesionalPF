import React from 'react';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <div className="ppf-main-wrapper">
      
      {/* 1. Encabezado Centrado */}
      <header style={{ marginBottom: 'var(--ppf-spacing-xl)' }}>
        <h1 style={{ color: 'var(--ppf-color-primary)', fontSize: '1.8rem' }}>
          P&PF <span style={{ fontWeight: '300', color: 'var(--ppf-color-text)' }}>| Finances</span>
        </h1>
        <p className="ppf-text-muted" style={{ fontSize: '0.9rem' }}>Gestión financiera personal</p>
      </header>

      {/* 2. Formulario (Modal Centrado) */}
      <main className="app-container">
        <AuthPage />
      </main>

      {/* 3. Estado del Servidor */}
      <footer style={{ marginTop: 'var(--ppf-spacing-xl)' }}>
        <div className="ppf-card ppf-card--translucent" style={{ padding: '8px 16px', borderRadius: '50px' }}>
          <span className="ppf-status-dot"></span>
          <span className="ppf-text-muted" style={{ fontSize: '0.8rem' }}>
            Servidor: <strong style={{ color: 'var(--ppf-color-ingresos)' }}>Online</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;