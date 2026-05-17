const mongoose = require('mongoose');

const tempOtpSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now, expires: 600 }, 
});

module.exports = mongoose.model('TempOtp', tempOtpSchema);