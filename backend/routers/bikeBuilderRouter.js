const express = require('express');
const router = express.Router();
const { getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems,
    getAnyItems,
    getNewStockCounts,
    getItemReviews
} = require('../controllers/bikeBuilderController');

router.get('/frame-item/:typeTag', getFrameItems);
router.get('/fork-item/:typeTag', getForkItems);
router.get('/groupset-item/:typeTag', getGroupsetItems);
router.get('/wheelset-item/:typeTag', getWheelsetItems);
router.get('/seat-item/:typeTag', getSeatItems);
router.get('/cockpit-item/:typeTag', getCockpitItems);
router.get('/:reference', getAnyItems);
router.post('/stock-count', getNewStockCounts);
router.get('/reviews/:itemId', getItemReviews);

module.exports = router;