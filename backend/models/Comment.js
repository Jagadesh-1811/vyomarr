const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  // Reference to the post being commented on
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogPost',
    required: true 
  },
  postType: {
    type: String,
    enum: ['article', 'whatif'],
    default: 'article'
  },
  // User info - can be from Firebase user or anonymous
  userId: { 
    type: String,  // Firebase UID
    index: true 
  },
  userEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  authorName: { 
    type: String, 
    required: true,
    default: 'Anonymous'
  },
  authorPhoto: {
    type: String,
    default: null
  },
  // Comment content
  text: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  // Parent comment for replies
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  // Engagement
  likes: { 
    type: Number, 
    default: 0 
  },
  likedBy: [{
    type: String  // Firebase UIDs
  }],
  // Status
  isApproved: {
    type: Boolean,
    default: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
