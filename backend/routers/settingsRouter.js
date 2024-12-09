const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const {
    getSettings,
    getAdminSettings,
    setMechanicPercentage,
    setNewAdminName,
    setDisplayStockLevelPOS,
    setDisplayExpenses,
    setNewStoreName,
    setNewStoreAddress,
    getStoreAddress
} = require("../controllers/settingsController");

router.get('/get-settings', verifyToken, checkRole('staff', 'admin'), getSettings);
router.get('/get-admin-settings', verifyToken, checkRole('admin'), getAdminSettings);
router.put('/set-mechanic-percentage', verifyToken, checkRole('admin'), setMechanicPercentage);
router.put('/set-new-admin-name/:admin_id', verifyToken, checkRole('admin'), setNewAdminName);
router.put('/set-display-stock-level-pos', verifyToken, checkRole('admin'), setDisplayStockLevelPOS);
router.put('/set-display-expenses', verifyToken, checkRole('admin'), setDisplayExpenses);
router.put('/set-new-store-name', verifyToken, checkRole('admin'), setNewStoreName);
router.put('/set-new-store-address', verifyToken, checkRole('admin'), setNewStoreAddress);
router.get('/get-store-address', getStoreAddress);

module.exports = router;