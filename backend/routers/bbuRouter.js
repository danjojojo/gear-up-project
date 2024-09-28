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
    getHeadsetItems,
    getHandlebarItems,
    getStemItems,
    getHubsItems,

    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateCockpitItem,
    updateHeadsetItem,
    updateHandlebarItem,
    updateStemItem,
    updateHubsItem,

    archiveFrameItem,
    archiveForkItem,
    archiveGroupsetItem,
    archiveWheelsetItem,
    archiveCockpitItem,
    archiveHeadsetItem,
    archiveHandlebarItem,
    archiveStemItem,
    archiveHubsItem,

    restoreFrameItem,
    restoreForkItem,
    restoreGroupsetItem,
    restoreWheelsetItem,
    restoreCockpitItem,
    restoreHeadsetItem,
    restoreHandlebarItem,
    restoreStemItem,
    restoreHubsItem,

    deleteFrameItem,
    deleteForkItem,
    deleteGroupsetItem,
    deleteWheelsetItem,
    deleteCockpitItem,
    deleteHeadsetItem,
    deleteHandlebarItem,
    deleteStemItem,
    deleteHubsItem,

} = require('../controllers/bbuController');


router.get('/part-count/:partType', getPartsCount);

router.get('/frame-item', getFrameItems);
router.get('/fork-item', getForkItems);
router.get('/groupset-item', getGroupsetItems);
router.get('/wheelset-item', getWheelsetItems);
router.get('/cockpit-item', getCockpitItems);
router.get('/headset-item', getHeadsetItems);
router.get('/handlebar-item', getHandlebarItems);
router.get('/stem-item', getStemItems);
router.get('/hubs-item', getHubsItems);

router.put('/update-frame/:id', upload.single('item_image'), updateFrameItem);
router.put('/update-fork/:id', upload.single('item_image'), updateForkItem);
router.put('/update-groupset/:id', upload.single('item_image'), updateGroupsetItem);
router.put('/update-wheelset/:id', upload.single('item_image'), updateWheelsetItem);
router.put('/update-cockpit/:id', upload.single('item_image'), updateCockpitItem);
router.put('/update-headset/:id', upload.single('item_image'), updateHeadsetItem);
router.put('/update-handlebar/:id', upload.single('item_image'), updateHandlebarItem);
router.put('/update-stem/:id', upload.single('item_image'), updateStemItem);
router.put('/update-hubs/:id', upload.single('item_image'), updateHubsItem);

router.put('/archive-frame/:frame_id', archiveFrameItem);
router.put('/archive-fork/:fork_id', archiveForkItem);
router.put('/archive-groupset/:groupset_id', archiveGroupsetItem);
router.put('/archive-wheelset/:wheelset_id', archiveWheelsetItem);
router.put('/archive-cockpit/:cockpit_id', archiveCockpitItem);
router.put('/archive-headset/:headset_id', archiveHeadsetItem);
router.put('/archive-handlebar/:handlebar_id', archiveHandlebarItem);
router.put('/archive-stem/:stem_id', archiveStemItem);
router.put('/archive-hubs/:hub_id', archiveHubsItem);

router.put('/restore-frame/:frame_id', restoreFrameItem);
router.put('/restore-fork/:fork_id', restoreForkItem);
router.put('/restore-groupset/:groupset_id', restoreGroupsetItem);
router.put('/restore-wheelset/:wheelset_id', restoreWheelsetItem);
router.put('/restore-cockpit/:cockpit_id', restoreCockpitItem);
router.put('/restore-headset/:headset_id', restoreHeadsetItem);
router.put('/restore-handlebar/:handlebar_id', restoreHandlebarItem);
router.put('/restore-stem/:stem_id', restoreStemItem);
router.put('/restore-hubs/:hub_id', restoreHubsItem);

router.put('/delete-frame/:frame_id', deleteFrameItem);
router.put('/delete-fork/:fork_id', deleteForkItem);
router.put('/delete-groupset/:groupset_id', deleteGroupsetItem);
router.put('/delete-wheelset/:wheelset_id', deleteWheelsetItem);
router.put('/delete-cockpit/:cockpit_id', deleteCockpitItem);
router.put('/delete-headset/:headset_id', deleteHeadsetItem);
router.put('/delete-handlebar/:handlebar_id', deleteHandlebarItem);
router.put('/delete-stem/:stem_id', deleteStemItem);
router.put('/delete-hubs/:hub_id', deleteHubsItem);

module.exports = router;