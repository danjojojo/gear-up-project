const express = require('express');
const router = express.Router();
const { 
    createCheckoutSession,
    createOrder
} = require('../controllers/checkoutController');

router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-order', createOrder);

module.exports = router;