// routes/sellerRoutes.js

const express = require('express');
const router = express.Router();
const { becomeSeller, addProduct, getSellerProducts, updateProduct, deleteProduct } = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const isSeller = require('../middleware/isSeller');

// Become a seller
router.put('/become-seller', protect, becomeSeller);

// Add product (seller only)
router.post('/products', protect, isSeller, addProduct);

// Get seller's products
router.get('/products', protect, isSeller, getSellerProducts);

router.put('/products/:id', protect, isSeller, updateProduct);
router.delete('/products/:id', protect, isSeller, deleteProduct);

module.exports = router;