const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); //

// --- 1. IMPORTACIÓN DE RUTAS ---
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingsRoutes = require('./routes/savingsRoutes');

const app = express();

// --- 2. MIDDLEWARES ---
app.use(helmet()); //

/**
 * CONFIGURACIÓN DE CORS PARA PRODUCCIÓN
 * Esto permite que tu URL de Vercel acceda a los datos del backend.
 */
app.use(cors({
    origin: [
        'http://localhost:5173', // Para pruebas locales
        'https://profesional-pf-git-main-camilotechcores-projects.vercel.app' // Tu URL actual de Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(morgan('dev')); //
app.use(express.json()); //

// --- 3. REGISTRO DE RUTAS ---
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use('/api/savings', savingsRoutes);

// --- 4. RUTA DE PRUEBA / SALUD DEL SISTEMA ---
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenido a la API de P&PF",
        status: "Operativo",
        governance: "UPPER_SNAKE_CASE",
        mode: process.env.NODE_ENV || 'production'
    });
});

// --- 5. PUERTO Y ARRANQUE ---
// Render asigna automáticamente un puerto, por eso usamos process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 P&PF Backend corriendo en el puerto ${PORT}`);
});