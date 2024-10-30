const express = require('express');
const router = express.Router();

const {
    getDashboardData,
    getProductLeaderBoard,
    getSummaryRecords,
    getReceiptOverview
} = require('../controllers/dashboardController');


router.get('/dashboard-data', getDashboardData);
router.get('/product-data', getProductLeaderBoard);
router.get('/summary-data', getSummaryRecords);
router.get('/receipt-data', getReceiptOverview);


module.exports = router;