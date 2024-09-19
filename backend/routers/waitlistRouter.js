const express = require('express');
const router = express.Router();
const { getWaitlistItems } = require('../controllers/waitlistController');

router.get('/waitlist-item', getWaitlistItems);

module.exports = router;