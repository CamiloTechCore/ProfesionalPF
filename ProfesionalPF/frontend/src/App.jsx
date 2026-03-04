import React from 'react';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    // 'ppf-bg' o simplemente el body manejará el fondo radial que definiste
    <div className="ppf-main-wrapper" style={{ padding: 'var(--ppf-spacing-lg)' }}>
      
      {/* Cabecera de la Aplicación */}
      <header style={{ textAlign: 'center', marginBottom: 'var(--ppf-spacing-xl)' }}>
        <h1 style={{ color: 'var(--ppf-color-primary)', fontSize: 'var(--ppf-text-2xl)', fontWeight: '800' }}>
          P&PF <span style={{ fontWeight: '300', color: 'var(--ppf-color-text)' }}>| Professional & Personal Finances</span>
        </h1>
        <p className="ppf-text-muted">Gestión financiera estricta y proyecciones de ahorro.</p>
      </header>

      {/* Contenedor Principal del SaaS */}
      <main className="app-container">
        <AuthPage />
      </main>

      {/* Indicador de Estado (Usando tus clases de utilidad) */}
      <footer style={{ 
        marginTop: 'var(--ppf-spacing-xl)', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <div className="ppf-card ppf-card--translucent" style={{ padding: 'var(--ppf-spacing-sm) var(--ppf-spacing-md)' }}>
          <span className="ppf-status-dot"></span>
          <span className="ppf-text-muted" style={{ fontSize: 'var(--ppf-text-sm)' }}>
            Servidor Central: <strong style={{ color: 'var(--ppf-color-ingresos)' }}>En Línea</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;