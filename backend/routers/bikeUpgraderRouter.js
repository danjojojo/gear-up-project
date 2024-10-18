const express = require('express');
const router = express.Router();
const { 
    getHeadsetItems,
} = require('../controllers/bikeUpgraderController');

router.get('/headset-item', getHeadsetItems);

module.exports = router;