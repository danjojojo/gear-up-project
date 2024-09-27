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
    updateCockpitItem,

    archiveFrameItem,
    archiveForkItem,
    archiveGroupsetItem,
    archiveWheelsetItem,
    archiveCockpitItem,

    restoreFrameItem,
    restoreForkItem,
    restoreGroupsetItem,
    restoreWheelsetItem,
    restoreCockpitItem,

    deleteFrameItem,
    deleteForkItem,
    deleteGroupsetItem,
    deleteWheelsetItem,
    deleteCockpitItem

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

router.put('/archive-frame/:frame_id', archiveFrameItem);
router.put('/archive-fork/:fork_id', archiveForkItem);
router.put('/archive-groupset/:groupset_id', archiveGroupsetItem);
router.put('/archive-wheelset/:wheelset_id', archiveWheelsetItem);
router.put('/archive-cockpit/:cockpit_id', archiveCockpitItem);

router.put('/restore-frame/:frame_id', restoreFrameItem);
router.put('/restore-fork/:fork_id', restoreForkItem);
router.put('/restore-groupset/:groupset_id', restoreGroupsetItem);
router.put('/restore-wheelset/:wheelset_id', restoreWheelsetItem);
router.put('/restore-cockpit/:cockpit_id', restoreCockpitItem);

router.put('/delete-frame/:frame_id', deleteFrameItem);
router.put('/delete-fork/:fork_id', deleteForkItem);
router.put('/delete-groupset/:groupset_id', deleteGroupsetItem);
router.put('/delete-wheelset/:wheelset_id', deleteWheelsetItem);
router.put('/delete-cockpit/:cockpit_id', deleteCockpitItem);

module.exports = router;