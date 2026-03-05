const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactionController');

// POST /api/transactions
router.post('/', createTransaction);

module.exports = router;