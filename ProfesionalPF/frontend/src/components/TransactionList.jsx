/* SECCIÓN: LISTADO DE MOVIMIENTOS (Fase 5.2) */
import React from 'react';

const TransactionList = ({ transactions }) => {
  return (
    <div className="ppf-card" style={{ marginTop: '2rem'}}>
      <h4 className="ppf-label" style={{ marginBottom: '1.5rem', textAlign: 'left', color: '#000' }}>
        HISTORIAL DE MOVIMIENTOS RECIENTES
      </h4>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--ppf-color-border)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th style={{ padding: '12px' }}>Categoría</th>
              <th style={{ padding: '12px' }}>Descripción</th>
              <th style={{ padding: '12px' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ppf-color-border)' }}>
                  <td style={{ padding: '12px' }}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: '600' }}>{t.category}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>{t.description}</td>
                  <td style={{ 
                    padding: '12px', 
                    fontWeight: 'bold', 
                    color: t.transaction_type === 'income' ? 'var(--ppf-color-ingresos)' : 'var(--ppf-color-gastos)' 
                  }}>
                    {t.transaction_type === 'income' ? '+' : '-'} ${parseFloat(t.amount_cop).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No hay transacciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;