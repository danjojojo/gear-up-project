const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { getWaitlistItems, addFrame } = require('../controllers/waitlistController');

router.get('/waitlist-item', getWaitlistItems);

router.post('/add-frame', upload.single('image'), addFrame);

module.exports = router;