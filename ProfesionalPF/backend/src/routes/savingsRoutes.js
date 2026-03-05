const express = require('express');
const router = express.Router();
// Importamos ambas funciones del controlador
const { getSavingsGoal, upsertSavingsGoal } = require('../controllers/savingsController');

// Ruta para LEER la meta (GET)
router.get('/goal/:userId', getSavingsGoal);


router.post('/set', upsertSavingsGoal); 

module.exports = router;