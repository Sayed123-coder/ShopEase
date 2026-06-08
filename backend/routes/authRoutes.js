const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  sendRegisterOtp,
  verifyRegisterOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-register-otp', sendRegisterOtp);
router.post('/verify-register-otp', verifyRegisterOtp);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true 
  }),
  (req, res) => { 
    
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      token,
    };

    const encodedUser = encodeURIComponent(JSON.stringify(userData));
    const redirectUrl = `${process.env.CLIENT_URL}/auth/google/success?user=${encodedUser}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;