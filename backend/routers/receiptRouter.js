const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const {
  getPosReceipts,
  getReceiptItems,
  getReceiptDates,
  staffVoidReceipt,
  adminVoidReceipt,
  cancelVoidReceipt,
  refundReceipt,
  adminCancelRefundReceipt,
  getReceiptsDashboard,
  getReceiptDetails
} = require("../controllers/receiptController");

router.get("/get-receipt-dates", verifyToken, checkRole('staff', 'admin'), getReceiptDates);
router.get("/get-pos-receipts/:startDate", verifyToken, checkRole('staff', 'admin'), getPosReceipts);
router.get("/get-receipt-items/:receiptSaleId", verifyToken, checkRole('staff', 'admin'), getReceiptItems);
router.put("/void-receipt/:receiptId", verifyToken, checkRole('staff'), staffVoidReceipt);
router.put("/admin-void-receipt/:receiptId", verifyToken, checkRole('admin'), adminVoidReceipt);
router.put("/cancel-void-receipt/:receiptId", verifyToken, checkRole('admin'), cancelVoidReceipt);
router.post("/refund-receipt", verifyToken, checkRole('staff'), refundReceipt);  
router.put("/admin-cancel-refund-receipt/:receiptId", verifyToken, checkRole('admin'), adminCancelRefundReceipt);
router.get("/get-receipts-dashboard", verifyToken, checkRole('staff','admin'), getReceiptsDashboard);
router.get("/get-receipt-details/:receiptSaleId", verifyToken, checkRole('staff', 'admin'), getReceiptDetails);

module.exports = router;