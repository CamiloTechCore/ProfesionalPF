const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares de seguridad y procesamiento
app.use(helmet());    // Protege encabezados HTTP
app.use(cors());      // Permite peticiones desde el frontend
app.use(morgan('dev')); // Registro de peticiones en consola
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.json({ message: "Bienvenido a la API de P&PF - Estado: Operativo" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});