const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const {
    getOrders,
    getOrdersItems,
    updateOrderStatus,
    updateOrderShipping,
    deductStockForCompletedOrder,
    getOrderDates,
    getOrderStatistics,
    getOrder,
    deleteExpiredOrder
} = require('../controllers/orderController');

router.get('/get-orders/:startDate', verifyToken, checkRole('admin'), getOrders);

router.get('/get-orders-items/:orderId', verifyToken, checkRole('admin'), getOrdersItems);

router.put('/update-order-status/:orderId', verifyToken, checkRole('admin'), updateOrderStatus);

router.put('/update-order-shipping/:orderId', verifyToken, checkRole('admin'), updateOrderShipping);

router.put('/deduct-stock-for-completed-order/:orderId', verifyToken, checkRole('admin'), deductStockForCompletedOrder);

router.get('/get-order-dates', verifyToken, checkRole('admin'), getOrderDates);

router.get('/get-order-statistics/:startDate', verifyToken, checkRole('admin'), getOrderStatistics);

router.get('/:orderId', getOrder);

router.delete('/delete-expired-order/:orderId', verifyToken, checkRole('admin'), deleteExpiredOrder);

module.exports = router;