
const express = require('express');
const router = express.Router();
const {
  makeOffer,
  getMyNegotiations,
  getAllNegotiations,
  respondToOffer,
  rejectCounter,
  getSellerNegotiations,
} = require('../controllers/negotiationController');
const { protect } = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/adminMiddleware');
const isSeller=require("../middleware/isSeller");

router.post('/', protect, makeOffer);


router.get('/my', protect, getMyNegotiations);


router.get('/all', protect,isAdmin, getAllNegotiations);

// Seller apni negotiations dekhe
router.get('/seller', protect,isSeller , getSellerNegotiations);

router.put('/:id', protect, isAdmin, respondToOffer);

router.put('/:id/reject-counter', protect, rejectCounter);

module.exports = router;