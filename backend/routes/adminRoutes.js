const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  approveSellerRequest,
  rejectSellerRequest,
  approveProduct,
  rejectProduct,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/approve-seller', approveSellerRequest);
router.put('/users/:id/reject-seller', rejectSellerRequest);
router.put('/products/:id/approve', approveProduct);
router.delete('/products/:id/reject', rejectProduct);

module.exports = router;
