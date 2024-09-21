const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { getWaitlistItems, addFrame, addFork } = require('../controllers/waitlistController');

router.get('/waitlist-item', getWaitlistItems);

router.post('/add-frame', upload.single('image'), addFrame);

router.post('/add-fork', upload.single('image'), addFork);

module.exports = router;