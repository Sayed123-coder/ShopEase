const User = require("../models/User");
const Product = require('../models/Product');

const becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'seller') return res.status(400).json({ message: 'Already a seller' });
    if (user.sellerRequest?.status === 'pending') {
      return res.status(400).json({ message: 'Request already pending!' });
    }
    if (user.sellerRequest?.rejectionCount >= 3) {
     return res.status(400).json({ 
      message: 'You have been rejected 3 times. You cannot apply again.' 
     });
    } 

    user.sellerRequest = {
      status: 'pending',
      requestedAt: new Date(),
    };
    await user.save();

    res.status(200).json({ message: 'Seller request submitted! Admin will review it.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price,originalPrice,category, brand, stock, images } = req.body;

    const product = await Product.create({
      name,
      seller: req.user._id,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
      images,
      isActive:false,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { becomeSeller, addProduct, getSellerProducts, updateProduct, deleteProduct };
