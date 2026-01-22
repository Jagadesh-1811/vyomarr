const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: { 
    type: String, 
    default: 'Explorer' 
  },
  photoURL: { 
    type: String, 
    default: null 
  },
  bio: { 
    type: String, 
    maxlength: 500,
    default: '' 
  },
  // Saved articles
  savedArticles: [{
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' },
    title: String,
    excerpt: String,
    image: String,
    category: String,
    author: String,
    url: String,
    savedAt: { type: Date, default: Date.now }
  }],
  // User's What If publications
  publications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WhatIf'
  }],
  // User's comments
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // User's liked articles
  likedArticles: [{
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' },
    likedAt: { type: Date, default: Date.now }
  }],
  // User activity log
  recentActivity: [{
    type: {
      type: String,
      enum: ['comment', 'like', 'save', 'publish', 'vote'],
      required: true
    },
    description: String,
    targetId: mongoose.Schema.Types.ObjectId,
    targetType: {
      type: String,
      enum: ['article', 'whatif', 'comment']
    },
    createdAt: { type: Date, default: Date.now }
  }],
  // Statistics
  stats: {
    publicationsCount: { type: Number, default: 0 },
    approvedCount: { type: Number, default: 0 },
    pendingCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 }
  },
  // Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: false }
  },
  role: { 
    type: String, 
    enum: ['user', 'contributor', 'admin'], 
    default: 'user' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamps on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for user's initial
UserSchema.virtual('initial').get(function() {
  return this.displayName ? this.displayName.charAt(0).toUpperCase() : 'E';
});

// Method to add activity
UserSchema.methods.addActivity = async function(activityType, description, targetId, targetType) {
  this.recentActivity.unshift({
    type: activityType,
    description,
    targetId,
    targetType,
    createdAt: new Date()
  });
  
  // Keep only last 50 activities
  if (this.recentActivity.length > 50) {
    this.recentActivity = this.recentActivity.slice(0, 50);
  }
  
  await this.save();
};

// Method to update stats
UserSchema.methods.updateStats = async function() {
  const WhatIf = mongoose.model('WhatIf');
  const Comment = mongoose.model('Comment');
  
  // Count publications
  const publications = await WhatIf.find({ authorEmail: this.email });
  this.stats.publicationsCount = publications.length;
  this.stats.approvedCount = publications.filter(p => p.status === 'approved').length;
  this.stats.pendingCount = publications.filter(p => p.status === 'pending').length;
  
  // Count comments
  const comments = await Comment.countDocuments({ userId: this.firebaseUid });
  this.stats.commentsCount = comments;
  
  // Count saved articles
  this.stats.savedCount = this.savedArticles.length;
  
  await this.save();
};

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
