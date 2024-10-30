const express = require('express');
const router = express.Router();
const {
    handlePaymongoWebhook
} = require('../controllers/webHookController');

router.post('/paymongo', handlePaymongoWebhook);

module.exports = router;