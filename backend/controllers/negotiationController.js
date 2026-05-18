
const Negotiation =require("../models/Negotiation.js");
const Product = require("../models/Product.js");

const makeOffer = async (req, res) => {
  try {
    const { productId, offeredPrice, message } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (offeredPrice >= product.price) {
      return res.status(400).json({ message: 'Offer price must be less than original price' });
    }

    const existing = await Negotiation.findOne({
      user: req.user._id,
      product: productId,
      status: 'Pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending offer on this product' });
    }

    const offerCount = await Negotiation.countDocuments({
        user: req.user._id,
        product: productId,
      });

    if (offerCount >= 3) {
     return res.status(400).json({ message: 'Offer limit reached for this product' });
    }

    const negotiation = await Negotiation.create({
      user: req.user._id,
      product: productId,
      originalPrice: product.price,
      offeredPrice,
      message,
    });

    res.status(201).json(negotiation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyNegotiations = async (req, res) => {
  try {
    const negotiations = await Negotiation.find({ user: req.user._id })
      .populate('product', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json(negotiations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllNegotiations = async (req, res) => {
  try {
    const negotiations = await Negotiation.find({})
      .populate('product', 'name price images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(negotiations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToOffer = async (req, res) => {
  try {
    const { status, counterPrice } = req.body;

    const negotiation = await Negotiation.findById(req.params.id)
      .populate({
       path: 'product',
       populate: { path: 'seller' }
     });

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    
    const isAdmin = req.user.role === 'admin';
    const isSeller = negotiation.product.seller._id.toString() === req.user._id.toString();

    if (!isAdmin && !isSeller) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['Accepted', 'Rejected', 'Countered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (status === 'Countered' && !counterPrice) {
      return res.status(400).json({ message: 'Counter price is required' });
    }

    negotiation.status = status;
    if (counterPrice) negotiation.counterPrice = counterPrice;
    await negotiation.save();

    res.status(200).json(negotiation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectCounter = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    
    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    if (negotiation.status !== 'Countered') {
      return res.status(400).json({ message: 'Only countered negotiations can be rejected' });
    }

    negotiation.status = 'Rejected';
    await negotiation.save();

    res.status(200).json(negotiation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSellerNegotiations = async (req, res) => {
  try {
    
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map(p => p._id);

    const negotiations = await Negotiation.find({
      product: { $in: productIds }
    })
      .populate('product', 'name price images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(negotiations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { makeOffer, getMyNegotiations, getAllNegotiations, respondToOffer, rejectCounter,getSellerNegotiations };
