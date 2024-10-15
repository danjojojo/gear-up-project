const express = require('express');
const router = express.Router();
const upload = require('../middleware/imgUploadMiddleware');
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const { addItem, displayItem, getDashboardData, getItemById, updateItem, archiveItem, restoreItem, deleteItem } = require('../controllers/inventoryController');

router.post('/add-item', verifyToken, checkRole('admin'), upload.single('itemImage'), addItem);

router.put('/item/:id', verifyToken, checkRole('admin'), upload.single('itemImage'), updateItem);

router.get('/display-item', verifyToken, checkRole('admin'), displayItem);

router.get('/dashboard-data', verifyToken, checkRole('admin'),  getDashboardData);

router.get('/item/:id', verifyToken, checkRole('admin'), getItemById);

router.put('/archive-item/:item_id', verifyToken, checkRole('admin'), archiveItem);

router.put('/restore-item/:item_id', verifyToken, checkRole('admin'), restoreItem);

router.put('/delete-item/:item_id', verifyToken, checkRole('admin'), deleteItem);

module.exports = router;