/* SECCIÓN: GRÁFICA DE CATEGORÍAS [cite: 1] */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#f59e0b', '#64748b'];

const CategoryChart = ({ data }) => {
  return (
    <div className="ppf-card ppf-chart-container">
      <h4 className="ppf-label ppf-chart-title">Distribución de Gastos</h4>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <p style={{color: '#000'}}>Sin gastos registrados.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;