const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const {
    getDashboardData,
    getRecords,
    getHighlightDates,
    getInnerRecords,
    getLeaderBoards
} = require('../controllers/recordsController');

router.get('/get-dashboard-data', verifyToken, checkRole('admin'), getDashboardData);

router.get('/get-records', verifyToken, checkRole('admin'), getRecords);

router.get('/get-highlight-dates', verifyToken, checkRole('admin'), getHighlightDates);

router.get('/get-inner-records', verifyToken, checkRole('admin'), getInnerRecords);

router.get('/get-leader-boards', verifyToken, checkRole('admin'), getLeaderBoards);

module.exports = router;