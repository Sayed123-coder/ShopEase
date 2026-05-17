const User = require('../models/User');
const jwt = require('jsonwebtoken');
const TempOtp=require("../models/TempOtp.js");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
          token: generateToken(updatedUser._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email!' });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    
    await transporter.sendMail({
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'ShopEase Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5;">🛒 ShopEase</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your OTP for password reset is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; text-align: center; padding: 20px; background: #f0f0ff; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent to your email!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpiry');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

   
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP!' });
    }

   
    if (user.resetPasswordOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired! Please request again.' });
    }

    
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const sendRegisterOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await TempOtp.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });

    await transporter.sendMail({
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'ShopEase - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5;">🛒 ShopEase</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your OTP to verify your email is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; text-align: center; padding: 20px; background: #f0f0ff; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 13px;">Valid for <strong>10 minutes</strong>. Do not share with anyone.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent! Check your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempOtp.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'OTP expired! Register again.' });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP!' });
    }

    if (tempUser.otpExpiry < new Date()) {
      await TempOtp.deleteOne({ email });
      return res.status(400).json({ success: false, message: 'OTP expired! Register again.' });
    }

    
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    
    await TempOtp.deleteOne({ email });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword, 
  resetPassword,
  sendRegisterOtp,  
  verifyRegisterOtp, 
};
