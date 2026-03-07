const express = require('express');
const router = express.Router();
const { signupUser, loginUser, getUserProfile, googleAuth, updateUserProfile } = require('../controllers/userController');


router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuth);
router.get('/profile/:userId', getUserProfile);
router.put('/update', updateUserProfile);

module.exports = router;