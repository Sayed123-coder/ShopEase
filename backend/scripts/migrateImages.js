const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const fs = require('fs');

const migrateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected!');

    const products = await Product.find({});
    console.log(`Total products: ${products.length}`);

    for (let product of products) {
      if (!product.images || product.images.length === 0) {
        console.log(`⚠️ No image for: ${product.name}`);
        continue;
      }

      const imageUrl = product.images[0];

      // Already Cloudinary pe hai
      if (imageUrl.includes('cloudinary.com')) {
        console.log(`✅ Already on Cloudinary: ${product.name}`);
        continue;
      }

      // Unsplash ya koi aur external URL — skip karo
      if (!imageUrl.includes('localhost')) {
        console.log(`⏭️ Skipping (external URL): ${product.name}`);
        continue;
      }

      // Localhost URL — migrate karo
      const filename = imageUrl.split('/uploads/')[1];
      if (!filename) {
        console.log(`⚠️ Invalid URL for: ${product.name}`);
        continue;
      }

      const localPath = path.join(__dirname, '../uploads', filename);

      // File exist karta hai?
      if (!fs.existsSync(localPath)) {
        console.log(`❌ File not found: ${localPath}`);
        continue;
      }

      // Cloudinary pe upload karo
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'shopease/products',
       });

      // DB mein URL update karo
      product.images = [result.secure_url];
      await product.save();

      console.log(`✅ Migrated: ${product.name} → ${result.secure_url}`);
    }

    console.log('\n🎉 Migration Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateImages();