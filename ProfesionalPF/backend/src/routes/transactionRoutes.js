const express = require('express');
const router = express.Router();
// Importamos la nueva función del controlador
const { 
    getNetBalance, 
    addTransaction, 
    getCategorySummary, 
    getTransactionHistory 
} = require('../controllers/transactionController');

router.get('/balance/:userId', getNetBalance);
router.get('/summary/:userId', getCategorySummary);
// NUEVA RUTA: Resuelve el error 404 /api/transactions/history/:userId
router.get('/history/:userId', getTransactionHistory); 
router.post('/add', addTransaction);

module.exports = router;