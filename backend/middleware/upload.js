const multer = require('multer');

// Memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
    }
  }
});

// Upload configurations for different routes
const postUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]);

const singleImageUpload = upload.single('image');

// Upload configuration for Space Mysteries (thumbnail + gallery images)
const spaceUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]);

module.exports = {
  upload,
  postUpload,
  singleImageUpload,
  spaceUpload
};
