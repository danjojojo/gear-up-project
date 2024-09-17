const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { addItem, displayItem, getDashboardData, getItemById, updateItem } = require('../controllers/inventoryController');

router.post('/add-item', upload.single('itemImage'), addItem);

router.put('/item/:id', upload.single('itemImage'), updateItem);

router.get('/display-item', displayItem);

router.get('/dashboard-data', getDashboardData);

router.get('/item/:id', getItemById);

module.exports = router;