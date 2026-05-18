const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" mein sirf ${product.stock} items available hain!`,
        });
      }
    }

    
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    
    const isAdmin = req.user.role === 'admin';
    const isSeller = req.user.role === 'seller';

    if (!isAdmin && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getSpendingReport = async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id,
      orderStatus: { $ne: 'Cancelled' }
    });

    if (orders.length === 0) {
      return res.status(200).json({
        totalSpent: 0,
        totalOrders: 0,
        monthlySpending: [],
        categorySpending: [],
      });
    }

    
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    
    const monthlyMap = {};
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      monthlyMap[month] = (monthlyMap[month] || 0) + order.totalPrice;
    });

    const monthlySpending = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }));

    
    const categoryMap = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const cat = item.category || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + item.price * item.quantity;
      });
    });

    const categorySpending = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    res.status(200).json({
      totalSpent,
      totalOrders: orders.length,
      monthlySpending,
      categorySpending,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
     
    
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: "The order is already canceled" 
      });
    }

    
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel shipped or delivered orders' });
    }

    
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getSellerOrders = async (req, res) => {
  try {
    
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    
    const orders = await Order.find({
      'orderItems.product': { $in: productIds }
    })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSpendingReport,
  cancelOrder,
  getSellerOrders,
};
