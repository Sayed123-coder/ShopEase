const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Buffer ko Cloudinary pe upload karo
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shopease/products', // Cloudinary mein folder
          transformation: [
            { width: 800, height: 800, crop: 'limit' }, // Max size
            { quality: 'auto' }, // Auto quality
            { fetch_format: 'auto' }, // Auto format (webp, etc)
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
      imageUrl: result.secure_url, // HTTPS URL
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;