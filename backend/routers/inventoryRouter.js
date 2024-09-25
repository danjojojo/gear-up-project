const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const { addItem, displayItem, getDashboardData, getItemById, updateItem, archiveItem, restoreItem, deleteItem } = require('../controllers/inventoryController');

router.post('/add-item', upload.single('itemImage'), addItem);

router.put('/item/:id', upload.single('itemImage'), updateItem);

router.get('/display-item', displayItem);

router.get('/dashboard-data', getDashboardData);

router.get('/item/:id', getItemById);

router.put('/archive-item/:item_id', archiveItem);

router.put('/restore-item/:item_id', restoreItem);

router.put('/delete-item/:item_id', deleteItem);

module.exports = router;