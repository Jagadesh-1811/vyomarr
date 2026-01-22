require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import config
const { connectDB } = require('./config/db');

// Import middleware
const { errorHandler, notFound } = require('./middleware');

// Import routes
const {
  postRoutes,
  commentRoutes,
  feedbackRoutes,
  subscriberRoutes,
  whatIfRoutes,
  adminRoutes,
  userRoutes,
  contactRoutes,
  spaceMysteryRoutes,
  siteConfigRoutes
} = require('./routes');

const app = express();

// 1. CONFIGURATION
console.log("🔍 Debug: Checking Environment Variables...");
console.log("   MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Found");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Not Found");

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. DATABASE CONNECTION
connectDB();

// 4. ROUTES
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/whatif', whatIfRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/spacemysteries', spaceMysteryRoutes);
app.use('/api/config', siteConfigRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vyomarr API is running',
    timestamp: new Date().toISOString()
  });
});

// 5. ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// 6. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
