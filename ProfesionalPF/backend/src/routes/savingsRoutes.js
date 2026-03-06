const express = require('express');
const router = express.Router();

// Importamos todas las funciones necesarias del controlador
const { 
    getSavingsGoal, 
    upsertSavingsGoal, 
    withdrawFromGoal, 
    depositToGoal 
} = require('../controllers/savingsController');

/**
 * RUTA: Obtener metas activas
 * GET /api/savings/goal/:userId
 * Se usa para llenar la tabla de proyecciones EA en el Dashboard
 */
router.get('/goal/:userId', getSavingsGoal);

/**
 * RUTA: Crear o actualizar meta
 * POST /api/savings/set
 * Registra nuevos CDTs o bolsillos de Neo bancos
 */
router.post('/set', upsertSavingsGoal);

/**
 * RUTA: Retirar fondos de una meta
 * POST /api/savings/withdraw
 * Resta del ahorro y suma al ingreso disponible (Genera registro negativo)
 */
router.post('/withdraw', withdrawFromGoal);

/**
 * RUTA: Aportar fondos a una meta existente
 * POST /api/savings/deposit
 * Suma al ahorro actual y resta del balance neto (Soluciona el error 404)
 */
router.post('/deposit', depositToGoal);

module.exports = router;