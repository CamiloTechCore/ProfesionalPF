const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactionController');
const { getNetBalance, addTransaction } = require('../controllers/transactionController');

// POST /api/transactions
router.post('/', createTransaction);


// Ruta para obtener el saldo en tiempo real
router.get('/balance/:userId', getNetBalance);
router.post('/add', addTransaction);

module.exports = router;