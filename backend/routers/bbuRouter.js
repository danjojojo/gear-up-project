const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { 
    getPartsCount, 
    getFrameItems, 
    getForkItems, 
    getGroupsetItems, 
    getWheelsetItems,
    getCockpitItems,
    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateCockpitItem
} = require('../controllers/bbuController');

router.get('/part-count/:partType', getPartsCount);

router.get('/frame-item', getFrameItems);

router.get('/fork-item', getForkItems);

router.get('/groupset-item', getGroupsetItems);

router.get('/wheelset-item', getWheelsetItems);

router.get('/cockpit-item', getCockpitItems);

router.put('/update-frame/:id', upload.single('item_image'), updateFrameItem);

router.put('/update-fork/:id', upload.single('item_image'), updateForkItem);

router.put('/update-groupset/:id', upload.single('item_image'), updateGroupsetItem);

router.put('/update-wheelset/:id', upload.single('item_image'), updateWheelsetItem);

router.put('/update-cockpit/:id', upload.single('item_image'), updateCockpitItem);

module.exports = router;