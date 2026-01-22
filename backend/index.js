require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();

// 1. CONFIGURATION
// Check if env variables are loaded
console.log("🔍 Debug: Checking Environment Variables...");
console.log("   MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Found");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Not Found");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. DATABASE CONNECTION
let isDBConnected = false;

const connectDB = async () => {
  try {
    // FALLBACK: If .env fails, use this local string directly
    const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/cloudinary-demo";

    await mongoose.connect(dbURI);
    console.log('✅ MongoDB Connected Successfully');
    isDBConnected = true;

    // Start the article scheduler after DB connection
    const { startScheduler } = require('./services/scheduler');
    startScheduler();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️  Server will continue running, but database operations will fail.');
    console.error('💡 TIP: Make sure your IP is whitelisted in MongoDB Atlas!');
    isDBConnected = false;
  }
};
connectDB();

// 3. SCHEMA DEFINITION
const BlogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  subHeading: { type: String },
  content: { type: String, required: true },
  youtubeEmbed: { type: String },
  thumbnail: {
    url: { type: String },
    publicId: { type: String }
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  likes: { type: Number, default: 0 },
  comments: [{
    name: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userType: { type: String },
  overallRating: { type: String },
  feedbackAreas: [{ type: String }],
  likes: { type: String },
  improvements: { type: String },
  features: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Subscriber Schema
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// What If Theory Schema
const WhatIfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  authorName: { type: String },
  authorEmail: { type: String, required: true },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const WhatIf = mongoose.model('WhatIf', WhatIfSchema);

// Nodemailer setup for email notifications
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email skipped (credentials not configured):', { to, subject });
      return false;
    }
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('📧 Email sent to:', to);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// 4. UPLOAD CONFIGURATION (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper: Upload Buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'vyomarr-blog',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// 5. ROUTES
// Configure upload fields for thumbnail and gallery images
const postUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]);

app.post('/api/posts', postUpload, async (req, res) => {
  try {
    // Handle thumbnail upload
    let thumbnailData = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0].buffer);
      thumbnailData = {
        url: thumbnailResult.secure_url,
        publicId: thumbnailResult.public_id
      };
    }

    // Handle gallery images
    const imageFiles = (req.files && req.files.images) || [];
    const imageUrls = [];

    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(file => uploadToCloudinary(file.buffer));
      const uploadResults = await Promise.all(uploadPromises);

      uploadResults.forEach(result => {
        imageUrls.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      });
    }

    const newPost = new BlogPost({
      category: req.body.category,
      title: req.body.title,
      subHeading: req.body.subHeading,
      content: req.body.content,
      youtubeEmbed: req.body.youtubeEmbed,
      thumbnail: thumbnailData,
      images: imageUrls
    });

    await newPost.save();
    res.status(201).json({ success: true, message: 'Blog post created!', data: newPost });
  } catch (error) {
    console.error('Error uploading post:', error);
    res.status(500).json({ error: 'Server Error during upload' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch posts' });
  }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Delete thumbnail from Cloudinary
    if (post.thumbnail && post.thumbnail.publicId) {
      await cloudinary.uploader.destroy(post.thumbnail.publicId);
    }

    // Delete gallery images from Cloudinary
    const deletePromises = post.images.map(img => cloudinary.uploader.destroy(img.publicId));
    await Promise.all(deletePromises);

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Like a post
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: 'Could not like post' });
  }
});

// Add a comment
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and text are required' });
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { name, text, createdAt: new Date() } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: 'Could not add comment' });
  }
});

// ============ COMMENTS MANAGEMENT ROUTES ============

// Get all comments from all posts (for admin dashboard)
app.get('/api/comments', async (req, res) => {
  try {
    const allComments = [];

    // 1. Get legacy BlogPost comments (embedded in posts)
    const posts = await BlogPost.find({ 'comments.0': { $exists: true } })
      .select('title comments')
      .sort({ createdAt: -1 });

    posts.forEach(post => {
      post.comments.forEach(comment => {
        allComments.push({
          _id: comment._id,
          postId: post._id,
          postType: 'article',
          articleTitle: post.title || 'Untitled Article',
          name: comment.name,
          text: comment.text,
          createdAt: comment.createdAt
        });
      });
    });

    // 2. Get new Comment model comments (from SpaceMystery, WhatIf, etc.)
    const Comment = require('./models/Comment');
    const SpaceMystery = require('./models/SpaceMystery');

    const newComments = await Comment.find().sort({ createdAt: -1 });

    // Fetch article titles for each comment
    for (const comment of newComments) {
      let articleTitle = 'Unknown Article';

      if (comment.postType === 'mystery' || comment.postType === 'article') {
        // Try SpaceMystery first
        const mystery = await SpaceMystery.findById(comment.postId).select('title');
        if (mystery) {
          articleTitle = mystery.title;
        } else {
          // Try BlogPost
          const blogPost = await BlogPost.findById(comment.postId).select('title');
          if (blogPost) {
            articleTitle = blogPost.title;
          }
        }
      } else if (comment.postType === 'whatif') {
        const whatif = await WhatIf.findById(comment.postId).select('title');
        if (whatif) {
          articleTitle = whatif.title;
        }
      }

      allComments.push({
        _id: comment._id,
        postId: comment.postId,
        postType: comment.postType,
        articleTitle: articleTitle,
        name: comment.authorName || 'Anonymous',
        text: comment.text,
        createdAt: comment.createdAt
      });
    }

    // Sort by date, newest first
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Wrap in data property for frontend compatibility
    res.json({ success: true, data: allComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Could not fetch comments' });
  }
});

// Delete a specific comment from a post
app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await BlogPost.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Could not delete comment' });
  }
});

// ============ FEEDBACK ROUTES ============

// Submit feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, userType, overallRating, feedbackAreas, likes, improvements, features } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      userType,
      overallRating,
      feedbackAreas,
      likes,
      improvements,
      features,
      status: 'pending'
    });

    await newFeedback.save();
    res.status(201).json({ success: true, message: 'Feedback submitted successfully!', data: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server Error during feedback submission' });
  }
});

// Get all feedback (for admin dashboard)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch feedback' });
  }
});

// Get single feedback by ID
app.get('/api/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch feedback' });
  }
});

// Update feedback status
app.patch('/api/feedback/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ error: 'Could not update feedback' });
  }
});

// Delete feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete feedback' });
  }
});

// ============ SUBSCRIBER ROUTES ============

// Subscribe a new user
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ error: 'Email is already subscribed' });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        return res.status(200).json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
      }
    }

    const newSubscriber = new Subscriber({
      email: email.toLowerCase(),
    });

    await newSubscriber.save();
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email is already subscribed' });
    }
    res.status(500).json({ error: 'Server Error during subscription' });
  }
});

// Get all subscribers (for admin dashboard)
app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch subscribers' });
  }
});

// Delete subscriber
app.delete('/api/subscribers/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ success: true, message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete subscriber' });
  }
});

// Unsubscribe (deactivate)
app.patch('/api/subscribers/:id/unsubscribe', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not unsubscribe' });
  }
});

// ============ WHAT IF THEORY ROUTES ============

// Submit a new theory (public)
app.post('/api/whatif', upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, authorName, authorEmail } = req.body;

    if (!title || !description || !authorEmail) {
      return res.status(400).json({ error: 'Title, description, and email are required' });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // Upload image if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image
      }
    }

    const newTheory = new WhatIf({
      title,
      category: category || 'Other',
      description,
      authorName: authorName || 'Anonymous',
      authorEmail: authorEmail.toLowerCase(),
      imageUrl,
      imagePublicId,
      status: 'pending'
    });

    await newTheory.save();
    res.status(201).json({ success: true, message: 'Theory submitted for review!', data: newTheory });
  } catch (error) {
    console.error('Error submitting theory:', error);
    res.status(500).json({ error: 'Server Error during theory submission' });
  }
});

// Get all approved theories (public)
app.get('/api/whatif', async (req, res) => {
  try {
    const theories = await WhatIf.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theories' });
  }
});

// Get user's own theories by email (for settings page)
app.get('/api/whatif/user/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const theories = await WhatIf.find({ authorEmail: email }).sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch user theories' });
  }
});

// Get all theories for admin (including pending)
app.get('/api/admin/whatif', async (req, res) => {
  try {
    const theories = await WhatIf.find().sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theories' });
  }
});

// Get single theory by ID
app.get('/api/whatif/:id', async (req, res) => {
  try {
    const theory = await WhatIf.findById(req.params.id);
    if (!theory) return res.status(404).json({ error: 'Theory not found' });
    res.json(theory);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theory' });
  }
});

// Approve a theory (admin)
app.patch('/api/admin/whatif/:id/approve', async (req, res) => {
  try {
    const theory = await WhatIf.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedAt: new Date(), rejectionReason: null },
      { new: true }
    );
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Send approval email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; color: #f8f9f9; padding: 30px; border-radius: 10px;">
        <h1 style="color: #fc4c00;">🎉 Your Theory Has Been Approved!</h1>
        <p>Hello ${theory.authorName || 'Space Explorer'},</p>
        <p>Great news! Your "What If" scenario has been reviewed and <strong style="color: #22c55e;">approved</strong> by our cosmic team.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #fc4c00;">${theory.title}</h3>
          <p style="margin: 0; color: #bfc3c6;">${theory.description.substring(0, 200)}...</p>
        </div>
        <p>Your theory is now live on Vyomarr and visible to our entire community!</p>
        <p style="color: #bfc3c6; font-size: 14px;">Thank you for contributing to our space exploration community.</p>
        <p>- The Vyomarr Team 🚀</p>
      </div>
    `;
    await sendEmail(theory.authorEmail, '🎉 Your Vyomarr Theory Has Been Approved!', emailHtml);

    res.json({ success: true, data: theory, message: 'Theory approved and user notified' });
  } catch (error) {
    console.error('Error approving theory:', error);
    res.status(500).json({ error: 'Could not approve theory' });
  }
});

// Reject a theory (admin)
app.patch('/api/admin/whatif/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const theory = await WhatIf.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedAt: new Date(), rejectionReason: reason || 'No reason provided' },
      { new: true }
    );
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Send rejection email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; color: #f8f9f9; padding: 30px; border-radius: 10px;">
        <h1 style="color: #fc4c00;">Theory Review Update</h1>
        <p>Hello ${theory.authorName || 'Space Explorer'},</p>
        <p>Thank you for submitting your "What If" scenario to Vyomarr. After careful review, we were unable to approve your submission at this time.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #fc4c00;">${theory.title}</h3>
          <p style="margin: 0 0 15px 0; color: #bfc3c6;">${theory.description.substring(0, 150)}...</p>
          <p style="margin: 0; color: #ef4444;"><strong>Reason:</strong> ${theory.rejectionReason}</p>
        </div>
        <p>Don't be discouraged! We encourage you to revise your theory and submit again. Here are some tips:</p>
        <ul style="color: #bfc3c6;">
          <li>Ensure your scenario has a scientific basis</li>
          <li>Provide clear and detailed explanations</li>
          <li>Check for factual accuracy</li>
        </ul>
        <p style="color: #bfc3c6; font-size: 14px;">If you have questions, feel free to reach out to our team.</p>
        <p>- The Vyomarr Team 🚀</p>
      </div>
    `;
    await sendEmail(theory.authorEmail, 'Vyomarr Theory Review Update', emailHtml);

    res.json({ success: true, data: theory, message: 'Theory rejected and user notified' });
  } catch (error) {
    console.error('Error rejecting theory:', error);
    res.status(500).json({ error: 'Could not reject theory' });
  }
});

// Delete a theory (admin)
app.delete('/api/admin/whatif/:id', async (req, res) => {
  try {
    const theory = await WhatIf.findById(req.params.id);
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Delete image from Cloudinary if exists
    if (theory.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(theory.imagePublicId);
      } catch (e) {
        console.error('Error deleting image:', e);
      }
    }

    await WhatIf.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Theory deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete theory' });
  }
});

// ============ CONTACT ROUTES ============

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'resolved'], default: 'new' },
  adminNotes: { type: String },
  repliedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', ContactSchema);

// Submit a new contact message (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({
      name,
      email: email.toLowerCase(),
      subject,
      message,
      status: 'new'
    });

    await newContact.save();

    // Send confirmation email to user
    const emailHtml = `
      <div style="font-family: 'Lato', sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; padding: 40px; border-radius: 16px;">
        <h1 style="color: #fc4c00; font-size: 28px; margin-bottom: 20px;">Thank you for reaching out!</h1>
        <p style="color: #f8f9f9; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #bfc3c6; font-size: 16px; line-height: 1.6;">
          We have received your message regarding "<strong style="color: #f8f9f9;">${subject}</strong>". 
          Our team will review it and get back to you within 24-48 hours.
        </p>
        <p style="color: #bfc3c6; font-size: 14px; margin-top: 30px;">
          Best regards,<br/>
          <strong style="color: #fc4c00;">The Vyomarr Team</strong>
        </p>
      </div>
    `;
    await sendEmail(email, 'We received your message - Vyomarr', emailHtml);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: newContact
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Server Error during contact submission' });
  }
});

// Get all contact messages (admin)
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contacts' });
  }
});

// Get contact statistics (admin)
app.get('/api/contact/stats', async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const readCount = await Contact.countDocuments({ status: 'read' });
    const repliedCount = await Contact.countDocuments({ status: 'replied' });
    const resolvedCount = await Contact.countDocuments({ status: 'resolved' });

    res.json({
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
      resolved: resolvedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contact statistics' });
  }
});

// Get single contact by ID (admin)
app.get('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contact' });
  }
});

// Update contact status (admin)
app.put('/api/contact/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const updateData = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'replied') updateData.repliedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Could not update contact' });
  }
});

// Delete contact message (admin)
app.delete('/api/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete contact' });
  }
});

// ============ SPACE MYSTERIES ROUTES ============
const spaceMysteryRoutes = require('./routes/spaceMysteryRoutes');
app.use('/api/spacemysteries', spaceMysteryRoutes);

const siteConfigRoutes = require('./routes/siteConfigRoutes');
app.use('/api/config', siteConfigRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});