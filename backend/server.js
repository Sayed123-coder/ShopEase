const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

// Passport config
require('./config/passport');

const app = express();

// CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'https://shop-ease-ochre.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

// Session — Passport ke liye zaroori
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/negotiations', require('./routes/negotiationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 E-Commerce API is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.yellow.bold);
});