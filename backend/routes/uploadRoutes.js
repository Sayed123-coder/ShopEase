const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');


router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shopease/products', 
          transformation: [
            { width: 800, height: 800, crop: 'limit' }, 
            { quality: 'auto' }, 
            { fetch_format: 'auto' }, 
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url, 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;