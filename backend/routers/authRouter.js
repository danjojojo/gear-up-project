const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginPOS, checkAdminExists} = require('../controllers/authController');

router.get('/admin-check', checkAdminExists);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/login-pos', loginPOS);

module.exports = router;