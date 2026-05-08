const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: '6.7-inch Super Retina XDR display, A17 Pro chip, Pro camera system with 5x optical zoom',
    price: 134900,
    originalPrice: 159900,
    category: 'Mobiles',
    brand: 'Apple',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1592286927505-8b5f8e2f2e4c?w=500'],
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI phone with 200MP camera, S Pen, and stunning 6.8" display',
    price: 129999,
    originalPrice: 149999,
    category: 'Mobiles',
    brand: 'Samsung',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    rating: 4.7,
    numReviews: 142,
    isFeatured: true,
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, NVIDIA RTX 4050',
    price: 145999,
    originalPrice: 169999,
    category: 'Computers',
    brand: 'Dell',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
    rating: 4.6,
    numReviews: 89,
    isFeatured: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, premium sound quality, 30-hour battery',
    price: 29990,
    originalPrice: 34990,
    category: 'Electronics',
    brand: 'Sony',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'],
    rating: 4.9,
    numReviews: 234,
    isFeatured: true,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Premium running shoes with Max Air cushioning and breathable mesh upper',
    price: 12995,
    originalPrice: 14995,
    category: 'Sports',
    brand: 'Nike',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    rating: 4.5,
    numReviews: 178,
    isFeatured: false,
  },
  {
    name: "Levi's Men's Denim Jacket",
    description: 'Classic trucker jacket in premium denim, timeless style',
    price: 4999,
    originalPrice: 6999,
    category: 'Fashion',
    brand: "Levi's",
    stock: 60,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    rating: 4.4,
    numReviews: 92,
    isFeatured: false,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker',
    price: 8999,
    originalPrice: 12999,
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1585515320310-259814833869?w=500'],
    rating: 4.7,
    numReviews: 312,
    isFeatured: false,
  },
  {
    name: 'Atomic Habits Book',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear',
    price: 599,
    originalPrice: 799,
    category: 'Books',
    brand: 'Penguin',
    stock: 150,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    rating: 4.9,
    numReviews: 523,
    isFeatured: true,
  },
  {
    name: 'Maybelline Fit Me Foundation',
    description: 'Natural finish foundation that matches skin tone and texture',
    price: 499,
    originalPrice: 649,
    category: 'Beauty',
    brand: 'Maybelline',
    stock: 200,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'],
    rating: 4.3,
    numReviews: 167,
    isFeatured: false,
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Build and display the iconic Millennium Falcon, 1351 pieces',
    price: 9999,
    originalPrice: 12999,
    category: 'Toys',
    brand: 'LEGO',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'],
    rating: 4.8,
    numReviews: 98,
    isFeatured: true,
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Full-frame mirrorless camera with 24.2MP sensor and 4K 60p video',
    price: 249999,
    originalPrice: 279999,
    category: 'Electronics',
    brand: 'Canon',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1606980720616-2ab951f8a2f4?w=500'],
    rating: 4.9,
    numReviews: 45,
    isFeatured: true,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Premium running shoes with responsive BOOST cushioning',
    price: 16999,
    originalPrice: 18999,
    category: 'Sports',
    brand: 'Adidas',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'],
    rating: 4.6,
    numReviews: 134,
    isFeatured: false,
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@shopease.com',
  password: 'admin123',
  role: 'admin',
  phone: '9876543210',
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Pehle admin create karo
    const createdAdmin = await User.create(adminUser);
    console.log('✅ Admin user created'.green.inverse);
    console.log('📧 Email: admin@shopease.com'.cyan);
    console.log('🔑 Password: admin123'.cyan);

    // Products mein seller add karo — admin ka _id
    const productsWithSeller = products.map(product => ({
      ...product,
      seller: createdAdmin._id, // 👈 Admin seller hai
    }));

    await Product.insertMany(productsWithSeller);
    console.log(`✅ ${products.length} products imported`.green.inverse);

    console.log('✅ Data Import Success!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}