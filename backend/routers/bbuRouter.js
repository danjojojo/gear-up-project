const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const {
    getBikeTypes,
    getPartSpecs,
    getAllParts,
    addBikeType,
    editBikeType,
    deleteBikeType,
    getPartsCount,
    getCompatibilitySpecs,

    addUpgraderSpecForm,
    updateUpgraderSpecForm,
    deleteUpgraderSpecForm,

    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems,
    getCockpitItems,

    updateFrameItem,
    updateForkItem,
    updateGroupsetItem,
    updateWheelsetItem,
    updateSeatItem,
    updateCockpitItem,

    archiveFrameItem,
    archiveForkItem,
    archiveGroupsetItem,
    archiveWheelsetItem,
    archiveSeatItem,
    archiveCockpitItem,

    restoreFrameItem,
    restoreForkItem,
    restoreGroupsetItem,
    restoreWheelsetItem,
    restoreSeatItem,
    restoreCockpitItem,

    deleteFrameItem,
    deleteForkItem,
    deleteGroupsetItem,
    deleteWheelsetItem,
    deleteSeatItem,
    deleteCockpitItem,

} = require('../controllers/bbuController');


router.get('/bike-types', getBikeTypes);
router.get('/all-parts', getAllParts);
router.get('/part-specs/:partName&:specId', getPartSpecs);
router.post('/add-bike-type', upload.single('image'), addBikeType);
router.put('/edit-bike-type/:bikeTypeId', upload.single('image'), editBikeType);
router.delete('/delete-bike-type/:bikeTypeId', deleteBikeType);
router.get('/part-count/:partType&:bikeType', getPartsCount);
router.get('/compatibility-specs/:bikeType', getCompatibilitySpecs);

router.post('/add-upgrader-spec-form', addUpgraderSpecForm);
router.put('/update-upgrader-spec-form/:specId', updateUpgraderSpecForm);
router.delete('/delete-upgrader-spec-form/:specId', deleteUpgraderSpecForm);

router.get('/frame-item', getFrameItems);
router.get('/fork-item', getForkItems);
router.get('/groupset-item', getGroupsetItems);
router.get('/wheelset-item', getWheelsetItems);
router.get('/seat-item', getSeatItems);
router.get('/cockpit-item', getCockpitItems);

router.put('/update-frame/:id', upload.single('item_image'), updateFrameItem);
router.put('/update-fork/:id', upload.single('item_image'), updateForkItem);
router.put('/update-groupset/:id', upload.single('item_image'), updateGroupsetItem);
router.put('/update-wheelset/:id', upload.single('item_image'), updateWheelsetItem);
router.put('/update-seat/:id', upload.single('item_image'), updateSeatItem);
router.put('/update-cockpit/:id', upload.single('item_image'), updateCockpitItem);

router.put('/archive-frame/:frame_id', archiveFrameItem);
router.put('/archive-fork/:fork_id', archiveForkItem);
router.put('/archive-groupset/:groupset_id', archiveGroupsetItem);
router.put('/archive-wheelset/:wheelset_id', archiveWheelsetItem);
router.put('/archive-seat/:seat_id', archiveSeatItem);
router.put('/archive-cockpit/:cockpit_id', archiveCockpitItem);

router.put('/restore-frame/:frame_id', restoreFrameItem);
router.put('/restore-fork/:fork_id', restoreForkItem);
router.put('/restore-groupset/:groupset_id', restoreGroupsetItem);
router.put('/restore-wheelset/:wheelset_id', restoreWheelsetItem);
router.put('/restore-seat/:seat_id', restoreSeatItem);
router.put('/restore-cockpit/:cockpit_id', restoreCockpitItem);

router.put('/delete-frame/:frame_id', deleteFrameItem);
router.put('/delete-fork/:fork_id', deleteForkItem);
router.put('/delete-groupset/:groupset_id', deleteGroupsetItem);
router.put('/delete-wheelset/:wheelset_id', deleteWheelsetItem);
router.put('/delete-seat/:seat_id', deleteSeatItem);
router.put('/delete-cockpit/:cockpit_id', deleteCockpitItem);;

module.exports = router;