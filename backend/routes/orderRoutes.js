const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSpendingReport,
  cancelOrder,
  getSellerOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const isSeller = require('../middleware/isSeller');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/seller-orders', protect, isSeller, getSellerOrders);
router.get('/spending-report', protect, getSpendingReport);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder); 

module.exports = router;
