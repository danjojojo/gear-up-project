const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const {
    getSummaryRecords,
    getHighlightDates,
    getReceiptDetails,
    getReceiptItems,
    getExpenseImage
} = require('../controllers/summaryController');


router.get('/get-summary-records', verifyToken, checkRole('admin'), getSummaryRecords);

router.get('/get-highlight-dates', verifyToken, checkRole('admin'), getHighlightDates);

router.get('/get-receipt-details', verifyToken, checkRole('admin'), getReceiptDetails);

router.get('/get-receipt-items', verifyToken, checkRole('admin'), getReceiptItems);

router.get('/get-expense-image', verifyToken, checkRole('admin'), getExpenseImage);

module.exports = router;