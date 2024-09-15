const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { addItem, displayItem } = require('../controllers/inventoryController');

router.post('/add-item',  upload.single('itemImage'), addItem);

router.get('/display-item', displayItem);

module.exports = router;