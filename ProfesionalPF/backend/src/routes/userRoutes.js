const express = require('express');
const router = express.Router();
// Importamos solo la función que definimos en el controlador
const { signupUser, getUserProfile } = require('../controllers/userController');
// Importamos el middleware de protección legal
const { checkHabeasData } = require('../middleware/habeasData');


// 2. Luego ejecuta el controlador (guarda en la DB)
router.post('/signup', checkHabeasData, signupUser);
router.get('/profile/:userId', getUserProfile);

module.exports = router;