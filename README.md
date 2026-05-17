# 🛒 ShopEase - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce website built with MERN stack (MongoDB, Express.js, React, Node.js) with unique features like **Bargain/Negotiate Price** and **Smart Spending Report** — features not available on any major e-commerce platform!

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

---

## ✨ Features

### **User Features**
- ✅ User registration with **Email OTP Verification**
- ✅ Login with Email/Password or **Google OAuth**
- ✅ **Forgot Password** with OTP reset
- ✅ Browse products with advanced filters (category, price range, search)
- ✅ **Navbar Search Bar** — search from anywhere
- ✅ Product detail page with complete information
- ✅ **Out of Stock** detection — disabled buttons when stock is 0
- ✅ Add to cart with quantity management
- ✅ **Go to Cart** button after adding product
- ✅ Secure checkout process (GST included in price)
- ✅ Order history with timeline tracking
- ✅ Cancel order (Pending/Processing stage)
- ✅ **🤝 Bargain/Negotiate Price** — Send price offers to sellers (UNIQUE FEATURE)
- ✅ **📊 Smart Spending Report** — Monthly & category-wise spending analytics (UNIQUE FEATURE)
- ✅ User Profile with avatar, gender, date of birth
- ✅ Responsive design (Mobile + Desktop)
- ✅ Active link highlight in Navbar
- ✅ Mobile menu auto-close on navigation

### **Seller Features**
- ✅ Apply to become a Seller — **Admin Approval Required**
- ✅ 3 rejection limit — permanently blocked after 3 rejections
- ✅ Seller Dashboard — Add, Edit, Delete own products
- ✅ **Product Approval System** — Products visible only after admin approval
- ✅ **Pending Approval** badge on dashboard for unapproved products
- ✅ Image upload with Cloudinary
- ✅ Handle negotiations on own products (Accept/Reject/Counter)
- ✅ **Seller Orders** — View & manage only own product orders
- ✅ Update order status (Pending → Processing → Shipped → Delivered)
- ✅ **Negotiation Badge** — Real-time pending count in Navbar (updates every 1 min)
- ✅ View spending report as a buyer

### **Admin Features**
- ✅ Admin dashboard with real-time statistics
- ✅ **Pending Products** count on dashboard card
- ✅ **Approve/Reject** seller product requests
- ✅ **Seller Wise** product management
- ✅ **Approve/Reject** seller account requests
- ✅ **Remove Seller** access without deleting account
- ✅ User management — view all users, delete accounts
- ✅ Order management and status updates
- ✅ Monitor all negotiations
- ✅ Revenue tracking
- ✅ **Pending Products badge** in Navbar (updates every 1 min)

### **Technical Features**
- ✅ Role-based access control (User/Seller/Admin)
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ **Google OAuth** with Passport.js
- ✅ **Email OTP** verification with Nodemailer
- ✅ RESTful API architecture
- ✅ MongoDB database with Mongoose ODM
- ✅ Cloudinary for image storage
- ✅ Context API for state management
- ✅ Toast notifications
- ✅ Loading skeletons for better UX
- ✅ **Stock validation** on order placement

---

## 🚀 Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling framework |
| Framer Motion | Animations |
| React Router | Client-side routing |
| Context API | State management |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| React Icons | Icon library |
| Recharts | Spending report charts |

### **Backend**
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Passport.js | Google OAuth |
| Nodemailer | Email OTP |
| Multer | File upload handling |
| Cloudinary | Image cloud storage |
| CORS | Cross-origin requests |
| express-session | Session management |

---

## 📁 Project Structure

```
ecommerce-bca-project/
│
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   ├── cloudinary.js             # Cloudinary configuration
│   │   └── passport.js               # Google OAuth configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication + OTP logic
│   │   ├── productController.js      # Product CRUD
│   │   ├── orderController.js        # Order management
│   │   ├── adminController.js        # Admin operations
│   │   ├── negotiationController.js  # Negotiation logic
│   │   └── sellerController.js       # Seller operations
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   ├── adminMiddleware.js        # Admin authorization
│   │   ├── isSeller.js               # Seller authorization
│   │   └── upload.js                 # Multer configuration
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Product.js                # Product schema
│   │   ├── Order.js                  # Order schema
│   │   ├── Negotiation.js            # Negotiation schema
│   │   └── TempOtp.js                # Temporary OTP schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── negotiationRoutes.js
│   │   ├── sellerRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── seedProducts.js           # Database seeding
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Footer, etc.
│   │   │   └── user/                 # ProductCard, CartItem
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   ├── CartContext.jsx       # Cart state
│   │   │   └── NegotiationContext.jsx # Negotiation state
│   │   ├── pages/
│   │   │   ├── user/                 # Home, Products, Cart, Orders, etc.
│   │   │   ├── auth/                 # Login, Register, GoogleSuccess
│   │   │   ├── admin/                # Dashboard, ManageProducts, AdminUsers, etc.
│   │   │   └── seller/               # SellerDashboard, SellerNegotiations, SellerOrders
│   │   ├── utils/
│   │   │   └── api.js                # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Installation Guide

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for OTP emails)
- Google Cloud Console account (for Google OAuth)

### **Step 1: Clone & Navigate**
```bash
cd ecommerce-bca-project
```

### **Step 2: Backend Setup**

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
SESSION_SECRET=any_random_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Seed the database:
```bash
node utils/seedProducts.js
```
**This will create:**
- Admin user: `admin@shopease.com` / `admin123`
- 12 sample products with seller field

5. Start backend server:
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

### **Step 3: Frontend Setup**

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

4. Start frontend server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### **Step 4: Access the Application**

| Role | URL | Email | Password |
|------|-----|-------|----------|
| User | http://localhost:5173 | Register from signup | - |
| Admin | http://localhost:5173/admin/dashboard | admin@shopease.com | admin123 |

---

## 📡 API Documentation

### **Base URL**: `http://localhost:5000/api`

### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/send-register-otp` | Send OTP for registration | Public |
| POST | `/verify-register-otp` | Verify OTP & create account | Public |
| POST | `/login` | User login | Public |
| GET | `/google` | Google OAuth login | Public |
| GET | `/google/callback` | Google OAuth callback | Public |
| POST | `/forgot-password` | Send reset OTP | Public |
| POST | `/reset-password` | Reset password with OTP | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update profile | Private |

### **Product Routes** (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all active products | Public |
| GET | `/featured` | Get featured products | Public |
| GET | `/admin/all` | Get all products (including inactive) | Admin |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### **Order Routes** (`/api/orders`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create order | Private |
| GET | `/myorders` | Get my orders | Private |
| GET | `/seller-orders` | Get seller's product orders | Seller |
| GET | `/spending-report` | Get spending report | Private |
| PUT | `/:id/cancel` | Cancel order | Private |
| GET | `/:id` | Get order by ID | Private |
| GET | `/` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin/Seller |

### **Negotiation Routes** (`/api/negotiations`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Make an offer | Private |
| GET | `/my` | Get my negotiations | Private |
| GET | `/seller` | Get seller negotiations | Seller |
| GET | `/all` | Get all negotiations | Admin |
| PUT | `/:id` | Respond to offer | Admin/Seller |
| PUT | `/:id/reject-counter` | Reject counter offer | Private |

### **Seller Routes** (`/api/seller`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PUT | `/become-seller` | Request seller access | Private |
| POST | `/products` | Add product (pending approval) | Seller |
| GET | `/products` | Get seller products | Seller |
| PUT | `/products/:id` | Update product | Seller |
| DELETE | `/products/:id` | Delete product | Seller |

### **Admin Routes** (`/api/admin`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Dashboard statistics | Admin |
| GET | `/users` | Get all users | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| PUT | `/users/:id/role` | Update user role | Admin |
| PUT | `/users/:id/approve-seller` | Approve seller request | Admin |
| PUT | `/users/:id/reject-seller` | Reject seller request | Admin |
| PUT | `/products/:id/approve` | Approve product | Admin |
| DELETE | `/products/:id/reject` | Reject & delete product | Admin |

### **Upload Routes** (`/api/upload`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Upload image to Cloudinary | Private |

---

## 🗄️ Database Schema

### **User Schema**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/seller/admin),
  phone: String,
  gender: String (Male/Female/Other),
  dateOfBirth: Date,
  avatar: String,
  address: { street, city, state, zipCode, country },
  sellerRequest: {
    status: String (none/pending/approved/rejected),
    requestedAt: Date,
    reviewedAt: Date,
    rejectionCount: Number,
  },
  resetPasswordOtp: String,
  resetPasswordOtpExpiry: Date,
  createdAt, updatedAt
}
```

### **Product Schema**
```javascript
{
  name: String,
  seller: ObjectId (ref: User),
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  brand: String,
  stock: Number,
  images: [String],
  rating: Number,
  numReviews: Number,
  isFeatured: Boolean,
  isActive: Boolean, // false until admin approves
  createdAt, updatedAt
}
```

### **Order Schema**
```javascript
{
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId,
    name, quantity, price, image, category
  }],
  shippingAddress: { street, city, state, zipCode, country, phone },
  paymentMethod: String (COD/Card/UPI/Net Banking),
  paymentStatus: String (Pending/Paid/Failed),
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  orderStatus: String (Pending/Processing/Shipped/Delivered/Cancelled),
  deliveredAt: Date,
  createdAt, updatedAt
}
```

### **Negotiation Schema**
```javascript
{
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  originalPrice: Number,
  offeredPrice: Number,
  counterPrice: Number,
  status: String (Pending/Accepted/Rejected/Countered),
  message: String,
  createdAt, updatedAt
}
```

### **TempOtp Schema**
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  otp: String,
  otpExpiry: Date,
  createdAt (auto-expires in 10 minutes)
}
```

---

## 🎓 Key Learning Outcomes

- Full-stack development with MERN
- RESTful API design
- Authentication & Authorization (JWT + Google OAuth)
- Role-based access control (User/Seller/Admin)
- Email OTP verification with Nodemailer
- State management with Context API
- Cloud image storage with Cloudinary
- Data visualization with Recharts
- Responsive web design with Tailwind CSS
- Database modeling with MongoDB
- Real-time UI updates with polling

---

## 👨‍💻 Author

**Sayed Aman**

---
**Made with ❤️ by Sayed Aman**