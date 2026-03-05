// SECCIÓN: REGISTRO DE RUTAS FINANCIERAS
const express = require('express');
const router = express.Router();
const { getNetBalance, addTransaction, getCategorySummary } = require('../controllers/transactionController');

// Ruta para obtener el saldo neto (Motor 4.2)
router.get('/balance/:userId', getNetBalance);

// Ruta para el resumen de categorías (Motor 5.1 - Resuelve error 404)
router.get('/summary/:userId', getCategorySummary);

// Ruta para agregar transacciones
router.post('/add', addTransaction);

module.exports = router;