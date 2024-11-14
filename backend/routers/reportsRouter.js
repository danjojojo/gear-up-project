const express = require('express');
const router = express.Router();
const {
    getSalesReport,
    getExpensesReport,
    getLaborReport,
    getOrderReport
} = require('../controllers/reportsController');

router.get('/sales-report', getSalesReport);
router.get('/expenses-report', getExpensesReport);
router.get('/labor-report', getLaborReport);
router.get('/order-report', getOrderReport);

module.exports = router;