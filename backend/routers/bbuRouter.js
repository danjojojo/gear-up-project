const express = require('express');
const router = express.Router();
const { 
    getPartsCount, 
    getFrameItems, 
    getForkItems, 
    getGroupsetItems, 
    getWheelsetItems,
    getCockpitItems
} = require('../controllers/bbuController');

router.get('/part-count/:partType', getPartsCount);

router.get('/frame-item', getFrameItems);

router.get('/fork-item', getForkItems);

router.get('/groupset-item', getGroupsetItems);

router.get('/wheelset-item', getWheelsetItems);

router.get('/cockpit-item', getCockpitItems);

module.exports = router;