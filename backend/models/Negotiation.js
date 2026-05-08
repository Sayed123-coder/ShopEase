// models/Negotiation.js

const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    offeredPrice: {
      type: Number,
      required: true,
    },
    counterPrice: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Countered'],
      default: 'Pending',
    },
    message: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Negotiation', negotiationSchema);