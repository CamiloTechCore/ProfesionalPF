const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// --- 1. IMPORTACIÓN DE RUTAS ---
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// --- 2. MIDDLEWARES ---
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- 3. REGISTRO DE RUTAS ---
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes); // <--- AHORA SÍ FUNCIONARÁ
app.use('/api/transactions', transactionRoutes); // <--- REGISTRO PARA LA FASE 4

// --- 4. RUTA DE PRUEBA ---
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenido a la API de P&PF",
        status: "Operativo",
        governance: "UPPER_SNAKE_CASE"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 P&PF Backend corriendo en el puerto ${PORT}`));