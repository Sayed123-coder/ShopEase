const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');
const User = require('../models/User');


const fixSellerField = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected...');

  const user = await User.findOne({ email: 'faheem@gmail.com' });
  
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }

  console.log('Seller found:',user._id);

  // Jitne bhi products mein seller null/undefined hai unhe fix karo
  const result = await Product.updateMany(
    { seller: { $exists: false } },  // seller field nahi hai jo products mein
    { $set: { seller:user._id } }
  );

  console.log(`Fixed ${result.modifiedCount} products!`);
  process.exit(0);
};

fixSellerField().catch((err) => {
  console.error(err);
  process.exit(1);
});