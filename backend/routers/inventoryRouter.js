const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { addItem } = require('../controllers/inventoryController');

router.post('/add-item',  upload.single('itemImage'), addItem);

module.exports = router;