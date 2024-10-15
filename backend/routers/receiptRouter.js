const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole')
const {
  getPosReceipts,
  getReceiptItems,
  getReceiptDates,
  staffVoidReceipt,
  adminVoidReceipt,
  cancelVoidReceipt
} = require("../controllers/receiptController");

router.get("/get-receipt-dates", verifyToken, checkRole('staff', 'admin'), getReceiptDates);
router.get("/get-pos-receipts/:startDate", verifyToken, checkRole('staff', 'admin'), getPosReceipts);
router.get("/get-receipt-items/:receiptSaleId", verifyToken, checkRole('staff', 'admin'), getReceiptItems);
router.put("/void-receipt/:receiptId", verifyToken, checkRole('staff'), staffVoidReceipt);
router.put("/admin-void-receipt/:receiptId", verifyToken, checkRole('admin'), adminVoidReceipt);
router.put("/cancel-void-receipt/:receiptId", verifyToken, checkRole('admin'), cancelVoidReceipt);

module.exports = router;