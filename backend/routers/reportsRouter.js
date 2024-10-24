const express = require('express');
const router = express.Router();
const {
    getSalesReport,
    getExpensesReport
} = require('../controllers/reportsController');

router.get('/sales-report', getSalesReport);
router.get('/expenses-report', getExpensesReport);

module.exports = router;