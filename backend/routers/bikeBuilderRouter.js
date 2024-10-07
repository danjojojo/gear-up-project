const express = require('express');
const router = express.Router();
const { getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems
} = require('../controllers/bikeBuilderController');

router.get('/frame-item', getFrameItems);
router.get('/fork-item', getForkItems);
router.get('/groupset-item', getGroupsetItems);
router.get('/wheelset-item', getWheelsetItems);
router.get('/seat-item', getSeatItems);
router.get('/cockpit-item', getCockpitItems);

module.exports = router;