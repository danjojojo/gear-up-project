const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole')
const {
  getPosReceipts,
  getReceiptItems,
  getReceiptMechanics,
  getReceiptDates
} = require("../controllers/receiptController");

router.get("/get-receipt-dates", verifyToken, checkRole('staff'), getReceiptDates);
router.get("/get-pos-receipts/:startDate", verifyToken, checkRole('staff'), getPosReceipts);
router.get("/get-receipt-items/:receiptSaleId", verifyToken, checkRole('staff'), getReceiptItems);
router.get("/get-receipt-mechanics/:receiptSaleId", verifyToken, checkRole('staff'), getReceiptMechanics);

module.exports = router;