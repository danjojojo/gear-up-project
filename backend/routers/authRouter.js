const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  loginPOS,
  checkPosExists,
  checkAdminExists,
  getMyRole,
  getMyName,
  logoutUser,
  refreshToken
} = require("../controllers/authController");

router.get('/admin-check', checkAdminExists);

router.get('/pos-check', checkPosExists);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/login-pos', loginPOS);

router.get('/me', verifyToken, getMyRole);

router.get('/my-name', verifyToken, getMyName);

router.post('/logout', logoutUser);

router.post('/refresh-token', refreshToken);

module.exports = router;