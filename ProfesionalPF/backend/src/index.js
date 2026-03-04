const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes'); 
const supabase = require('./supabaseClient');
require('dotenv').config();

const app = express();

// --- 1. Middlewares de Seguridad y Utilidad ---
app.use(helmet());       // Protege encabezados HTTP contra vulnerabilidades comunes
app.use(cors());         // Permite que tu Frontend en Vercel se comunique con esta API
app.use(morgan('dev'));  // Muestra en consola cada petición que llega (útil para debug)
app.use(express.json()); // Permite que el servidor entienda datos en formato JSON

// --- 2. Registro de Rutas Modulares ---
// Todas las rutas de usuario empezarán con /api/users
app.use('/api/users', userRoutes);

// --- 3. Rutas de Control / Salud del Sistema ---
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenido a la API de P&PF",
        status: "Operativo",
        version: "1.0.0",
        governance: "UPPER_SNAKE_CASE"
    });
});

// --- 4. Inicialización del Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 P&PF Backend corriendo en el puerto ${PORT}`);
    console.log(`🔗 Endpoint de prueba: http://localhost:${PORT}/`);
});