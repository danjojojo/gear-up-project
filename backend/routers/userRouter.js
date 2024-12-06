const express = require('express');
const router = express.Router();    
const upload = require("../middleware/imgUploadMiddleware"); 
const verifyToken = require('../middleware/authMiddleware');
const {
    loginUser,
    logoutUser,
    getProfile,
    getOrderHistory,
    submitReview
} = require('../controllers/userController');

router.post('/login', loginUser);

router.get('/profile', verifyToken, getProfile);

router.post('/logout', logoutUser);

router.get('/order-history', verifyToken, getOrderHistory);

router.post('/submit-review', verifyToken, upload.single('reviewImage'), submitReview);

module.exports = router;