const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const {
    getWaitlistItems,
    addFrame,
    addFork,
    addGroupset,
    addWheelset,
    addCockpit
} = require('../controllers/waitlistController');

router.get('/waitlist-item', getWaitlistItems);

router.post('/add-frame', upload.single('image'), addFrame);

router.post('/add-fork', upload.single('image'), addFork);

router.post('/add-groupset', upload.single('image'), addGroupset);

router.post('/add-wheelset', upload.single('image'), addWheelset);

router.post('/add-cockpit', upload.single('image'), addCockpit);

module.exports = router;