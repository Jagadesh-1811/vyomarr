const Comment = require('../models/Comment');
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const WhatIf = require('../models/WhatIf');

// @desc    Add a comment to a post
// @route   POST /api/comments
// @access  Public
const addComment = async (req, res) => {
  try {
    const {
      postId,
      postType,
      userId,
      userEmail,
      authorName,
      authorPhoto,
      text,
      parentCommentId
    } = req.body;

    if (!postId || !text) {
      return res.status(400).json({
        success: false,
        error: 'Post ID and comment text are required'
      });
    }

    // Create the comment
    const comment = await Comment.create({
      postId,
      postType: postType || 'article',
      userId,
      userEmail: userEmail?.toLowerCase(),
      authorName: authorName || 'Anonymous',
      authorPhoto,
      text,
      parentCommentId
    });

    // If user is logged in, update their profile
    if (userId) {
      const user = await User.findOne({ firebaseUid: userId });
      if (user) {
        user.comments.push(comment._id);
        user.stats.commentsCount = (user.stats.commentsCount || 0) + 1;

        // Add to activity log
        await user.addActivity(
          'comment',
          `Commented on ${postType === 'whatif' ? 'a What If theory' : 'an article'}`,
          postId,
          postType
        );
      }
    }

    // Also add to the BlogPost's embedded comments for backward compatibility
    if (postType === 'article') {
      await BlogPost.findByIdAndUpdate(postId, {
        $push: {
          comments: {
            name: authorName || 'Anonymous',
            text,
            createdAt: new Date()
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding comment'
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({
      postId,
      parentCommentId: null,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
          isApproved: true
        }).sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    const total = await Comment.countDocuments({
      postId,
      parentCommentId: null,
      isApproved: true
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: commentsWithReplies
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching comments'
    });
  }
};

// @desc    Get user's comments
// @route   GET /api/comments/user/:userId
// @access  Private
const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Populate post info
    const commentsWithPostInfo = await Promise.all(
      comments.map(async (comment) => {
        let postTitle = 'Unknown';
        let postUrl = '#';

        if (comment.postType === 'article') {
          const post = await BlogPost.findById(comment.postId).select('title');
          if (post) {
            postTitle = post.title;
            postUrl = `/article/${comment.postId}`;
          }
        } else if (comment.postType === 'whatif') {
          const theory = await WhatIf.findById(comment.postId).select('title');
          if (theory) {
            postTitle = theory.title;
            postUrl = `/whatif/${comment.postId}`;
          }
        }

        return {
          ...comment.toObject(),
          postTitle,
          postUrl
        };
      })
    );

    const total = await Comment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      data: commentsWithPostInfo
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching user comments'
    });
  }
};

// @desc    Like/Unlike a comment
// @route   POST /api/comments/:commentId/like
// @access  Private
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    const likeIndex = comment.likedBy.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      comment.likedBy.splice(likeIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Like
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      liked: likeIndex === -1,
      likes: comment.likes
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error toggling like'
    });
  }
};

// @desc    Edit a comment
// @route   PUT /api/comments/:commentId
// @access  Private
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Verify ownership
    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to edit this comment'
      });
    }

    comment.text = text;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated',
      data: comment
    });
  } catch (error) {
    console.error('Edit comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error editing comment'
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, isAdmin } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Allow admin to delete any comment, otherwise verify ownership
    if (!isAdmin && comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    // Delete replies too
    await Comment.deleteMany({ parentCommentId: commentId });
    await comment.deleteOne();

    // Update user stats
    if (comment.userId) {
      const user = await User.findOne({ firebaseUid: comment.userId });
      if (user) {
        user.comments = user.comments.filter(c => c.toString() !== commentId);
        user.stats.commentsCount = Math.max(0, (user.stats.commentsCount || 1) - 1);
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting comment'
    });
  }
};

// @desc    Get all comments (admin)
// @route   GET /api/comments/all
// @access  Admin
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments();

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      data: comments
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching comments'
    });
  }
};

module.exports = {
  addComment,
  getPostComments,
  getUserComments,
  toggleCommentLike,
  editComment,
  deleteComment,
  getAllComments
};
