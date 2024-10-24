const express = require('express');
const router = express.Router();
const {
    getSalesReport,
    getExpensesReport,
    getLaborReport
} = require('../controllers/reportsController');

router.get('/sales-report', getSalesReport);
router.get('/expenses-report', getExpensesReport);
router.get('/labor-report', getLaborReport);

module.exports = router;