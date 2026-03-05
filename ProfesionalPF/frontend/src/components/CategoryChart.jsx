import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#f59e0b', '#64748b'];

const CategoryChart = ({ data }) => {
  // Función para renderizar el porcentaje en la gráfica
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="20" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="ppf-card">
      <h4 className="ppf-label ppf-chart-title">DISTRIBUCIÓN DE GASTOS</h4>
      
      {data && data.length > 0 ? (
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                /* Gráfica más gruesa: aumentamos la diferencia entre radios */
                innerRadius={50} 
                outerRadius={90} 
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel} // Marcador de porcentaje
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend iconType="circle" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="ppf-empty-state">
          <p>Sin gastos registrados para mostrar distribución.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;