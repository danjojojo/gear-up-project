const express = require('express');
const router = express.Router();
const {
    getSalesReport
} = require('../controllers/reportsController');

router.get('/sales-report', getSalesReport);

module.exports = router;