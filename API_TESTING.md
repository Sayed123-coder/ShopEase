# 🧪 API TESTING GUIDE

Test all endpoints using tools like **Postman** or **Thunder Client** (VS Code extension)

---

## 📍 Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ AUTHENTICATION ENDPOINTS

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

### Get Profile (Requires Token)
```http
GET /api/auth/profile
Authorization: Bearer <your-token-here>
```

---

## 2️⃣ PRODUCT ENDPOINTS

### Get All Products
```http
GET /api/products
```

### Get Products with Filters
```http
GET /api/products?category=Electronics&minPrice=10000&maxPrice=50000&sort=price_asc
```

**Query Parameters:**
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search in name/description
- `sort`: price_asc, price_desc, name, rating

### Get Featured Products
```http
GET /api/products/featured
```

### Get Single Product
```http
GET /api/products/<product-id>
```

### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Amazing product description",
  "price": 29999,
  "originalPrice": 34999,
  "category": "Electronics",
  "brand": "Samsung",
  "stock": 50,
  "images": ["https://via.placeholder.com/300"]
}
```

### Update Product (Admin Only)
```http
PUT /api/products/<product-id>
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 27999,
  "stock": 45
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/<product-id>
Authorization: Bearer <admin-token>
```

---

## 3️⃣ ORDER ENDPOINTS

### Create Order (Requires Auth)
```http
POST /api/orders
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "<product-id>",
      "name": "Product Name",
      "quantity": 2,
      "price": 29999,
      "image": "https://..."
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "itemsPrice": 59998,
  "taxPrice": 10799.64,
  "shippingPrice": 0,
  "totalPrice": 70797.64
}
```

### Get My Orders (User)
```http
GET /api/orders/myorders
Authorization: Bearer <user-token>
```

### Get All Orders (Admin)
```http
GET /api/orders
Authorization: Bearer <admin-token>
```

### Update Order Status (Admin)
```http
PUT /api/orders/<order-id>/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "orderStatus": "Shipped",
  "paymentStatus": "Paid"
}
```

**Order Status Options:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

---

## 4️⃣ ADMIN ENDPOINTS

### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalProducts": 25,
    "totalOrders": 50,
    "totalRevenue": "125000.00",
    "recentOrders": [...],
    "ordersByStatus": [...],
    "lowStockProducts": [...]
  }
}
```

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

### Delete User
```http
DELETE /api/admin/users/<user-id>
Authorization: Bearer <admin-token>
```

---

## 🔐 AUTHENTICATION NOTES

1. **Get Token**: Login or register to receive JWT token
2. **Use Token**: Add to Authorization header as `Bearer <token>`
3. **Admin Token**: Login with admin@ecommerce.com / admin123

---

## ✅ TEST SCENARIOS

### Scenario 1: Complete User Journey
1. Register new user
2. Login
3. Get all products
4. Get single product details
5. Create order
6. Get my orders

### Scenario 2: Admin Operations
1. Login as admin
2. Get dashboard stats
3. Create new product
4. Update product
5. Get all orders
6. Update order status
7. Get all users

### Scenario 3: Filter & Search
1. Get products by category
2. Filter by price range
3. Sort by price
4. Search products by keyword

---

## 🐛 ERROR RESPONSES

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## 📝 POSTMAN COLLECTION

You can import this collection to Postman for easier testing:

1. Create new collection named "BCA E-Commerce"
2. Add requests for each endpoint above
3. Create environment variables:
   - `baseURL`: http://localhost:5000/api
   - `userToken`: (set after login)
   - `adminToken`: (set after admin login)

---

**Happy Testing! 🚀**
