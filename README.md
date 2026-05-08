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
- ✅ User registration and authentication with JWT
- ✅ Browse products with advanced filters (category, price range, search)
- ✅ Product detail page with complete information
- ✅ Add to cart with quantity management
- ✅ Secure checkout process
- ✅ Order history with timeline tracking
- ✅ Cancel order (Pending/Processing stage)
- ✅ **🤝 Bargain/Negotiate Price** — Send price offers to sellers (UNIQUE FEATURE)
- ✅ **📊 Smart Spending Report** — Monthly & category-wise spending analytics (UNIQUE FEATURE)
- ✅ User Profile with avatar, gender, date of birth
- ✅ Responsive design (Mobile + Desktop)

### **Seller Features**
- ✅ Become a Seller from Profile page
- ✅ Seller Dashboard — Add, Edit, Delete own products
- ✅ Image upload with Cloudinary
- ✅ Handle negotiations on own products (Accept/Reject/Counter)
- ✅ View spending report as a buyer

### **Admin Features**
- ✅ Admin dashboard with real-time statistics
- ✅ Product CRUD operations with image upload
- ✅ Order management and status updates
- ✅ Monitor all negotiations
- ✅ Revenue tracking

### **Technical Features**
- ✅ Role-based access control (User/Seller/Admin)
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ RESTful API architecture
- ✅ MongoDB database with Mongoose ODM
- ✅ Cloudinary for image storage
- ✅ Context API for state management
- ✅ Toast notifications
- ✅ Loading skeletons for better UX

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
| Multer | File upload handling |
| Cloudinary | Image cloud storage |
| CORS | Cross-origin requests |

---

## 📁 Project Structure

ecommerce-bca-project/
│
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── cloudinary.js             # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
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
│   │   └── Negotiation.js            # Negotiation schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── negotiationRoutes.js
│   │   ├── sellerRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/
│   │   └── migrateImages.js          # Cloudinary migration script
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
│   │   │   ├── auth/                 # Login, Register
│   │   │   ├── admin/                # Dashboard, ManageProducts, etc.
│   │   │   └── seller/               # SellerDashboard, SellerNegotiations
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

---

## 🛠️ Installation Guide

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### **Step 1: Extract & Navigate**
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

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4. Seed the database:
```bash
node utils/seedProducts.js
```
**This will create:**
- Admin user: `admin@shopease.com` / `admin123`
- 12 sample products

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

3. Start frontend server:
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
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update profile | Private |

### **Product Routes** (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all products | Public |
| GET | `/featured` | Get featured products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### **Order Routes** (`/api/orders`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create order | Private |
| GET | `/myorders` | Get my orders | Private |
| GET | `/spending-report` | Get spending report | Private |
| PUT | `/:id/cancel` | Cancel order | Private |
| GET | `/:id` | Get order by ID | Private |
| GET | `/` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin |

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
| PUT | `/become-seller` | Become a seller | Private |
| POST | `/products` | Add product | Seller |
| GET | `/products` | Get seller products | Seller |
| PUT | `/products/:id` | Update product | Seller |
| DELETE | `/products/:id` | Delete product | Seller |

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
  address: {
    street, city, state, zipCode, country
  },
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
  isActive: Boolean,
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
  shippingAddress: {
    street, city, state, zipCode, country, phone
  },
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
---

## 🎓 Key Learning Outcomes

- Full-stack development with MERN
- RESTful API design
- Authentication & Authorization
- Role-based access control (User/Seller/Admin)
- State management with Context API
- Cloud image storage with Cloudinary
- Data visualization with Recharts
- Responsive web design with Tailwind CSS
- Database modeling with MongoDB

---

## 👨‍💻 Author

**Sayed Aman**
---
**Made with ❤️ by Sayed Aman**