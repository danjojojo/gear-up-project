const express = require('express');
const router = express.Router();
const { getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getCockpitItems,
    getHeadsetItems,
    getHandlebarItems,
    getStemItems,
    getHubsItems
} = require('../controllers/bikeBuilderController');

router.get('/frame-item', getFrameItems);
router.get('/fork-item', getForkItems);
router.get('/groupset-item', getGroupsetItems);
router.get('/wheelset-item', getWheelsetItems);
router.get('/cockpit-item', getCockpitItems);
router.get('/headset-item', getHeadsetItems);
router.get('/handlebar-item', getHandlebarItems);
router.get('/stem-item', getStemItems);
router.get('/hubs-item', getHubsItems);

module.exports = router;