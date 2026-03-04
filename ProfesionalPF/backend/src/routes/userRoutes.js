const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const { checkHabeasData } = require('../middleware/habeasData');

// Ruta: POST /api/users/signup
router.post('/signup', checkHabeasData, registerUser);

module.exports = router;