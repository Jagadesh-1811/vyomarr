const User = require('../models/User');
const WhatIf = require('../models/WhatIf');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// @desc    Create or get user profile (called on login)
// @route   POST /api/users/auth
// @access  Public
const authenticateUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        error: 'Firebase UID and email are required'
      });
    }

    // Find user by firebaseUid first, then by email
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // User not found by UID, check by email (might be existing user with updated UID)
      user = await User.findOne({ email });
    }

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.firebaseUid = firebaseUid; // Update UID in case it changed
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL,
        lastLogin: new Date()
      });
    }

    // Populate publications
    await user.populate('publications');

    // Generate JWT for normal user
    const jwt = require('jsonwebtoken'); // Ensure this is available
    const token = jwt.sign({ id: user._id, firebaseUid: user.firebaseUid }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Send token in HTTP-only cookie
    res.cookie('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      data: user,
      token // Optional: return token in body if needed for client storage
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

// @desc    Get user profile by Firebase UID
// @route   GET /api/users/profile/:firebaseUid
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid })
      .populate({
        path: 'publications',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:firebaseUid
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { displayName, bio, photoURL, preferences } = req.body;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update fields
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (photoURL) user.photoURL = photoURL;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating profile'
    });
  }
};

// @desc    Save an article
// @route   POST /api/users/:firebaseUid/saved-articles
// @access  Private
const saveArticle = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { articleId, title, excerpt, image, category, author, url } = req.body;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already saved
    const alreadySaved = user.savedArticles.some(
      article => article.articleId?.toString() === articleId || article.url === url
    );

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        error: 'Article already saved'
      });
    }

    // Add to saved articles
    user.savedArticles.push({
      articleId,
      title,
      excerpt,
      image,
      category,
      author,
      url,
      savedAt: new Date()
    });

    user.stats.savedCount = user.savedArticles.length;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Article saved successfully',
      data: user.savedArticles
    });
  } catch (error) {
    console.error('Save article error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error saving article'
    });
  }
};

// @desc    Remove saved article
// @route   DELETE /api/users/:firebaseUid/saved-articles/:articleId
// @access  Private
const unsaveArticle = async (req, res) => {
  try {
    const { firebaseUid, articleId } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove from saved articles
    user.savedArticles = user.savedArticles.filter(
      article => article._id.toString() !== articleId &&
        article.articleId?.toString() !== articleId
    );

    user.stats.savedCount = user.savedArticles.length;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Article removed from saved',
      data: user.savedArticles
    });
  } catch (error) {
    console.error('Unsave article error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error removing article'
    });
  }
};

// @desc    Get user's saved articles
// @route   GET /api/users/:firebaseUid/saved-articles
// @access  Private
const getSavedArticles = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    // Find by firebaseUid or by searching recent auth
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        data: [] // Return empty array instead of just error
      });
    }

    // Sort by savedAt descending
    const savedArticles = (user.savedArticles || []).sort(
      (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
    );

    res.status(200).json({
      success: true,
      count: savedArticles.length,
      data: savedArticles
    });
  } catch (error) {
    console.error('Get saved articles error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching saved articles'
    });
  }
};

// @desc    Get user's publications (What If theories)
// @route   GET /api/users/:firebaseUid/publications
// @access  Private
const getUserPublications = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's What If submissions by email
    const publications = await WhatIf.find({
      authorEmail: user.email
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: publications.length,
      data: publications
    });
  } catch (error) {
    console.error('Get publications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching publications'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/:firebaseUid/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get publications count
    const publicationsCount = await WhatIf.countDocuments({
      authorEmail: user.email
    });

    // Get approved publications count
    const approvedCount = await WhatIf.countDocuments({
      authorEmail: user.email,
      status: 'approved'
    });

    // Get pending publications count
    const pendingCount = await WhatIf.countDocuments({
      authorEmail: user.email,
      status: 'pending'
    });

    // Get comments count
    const commentsCount = await Comment.countDocuments({
      userId: firebaseUid
    });

    res.status(200).json({
      success: true,
      data: {
        publicationsCount,
        approvedCount,
        pendingCount,
        savedCount: user.savedArticles.length,
        commentsCount,
        totalVotes: user.stats.totalVotes || 0,
        likedArticlesCount: user.likedArticles?.length || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching stats'
    });
  }
};

// @desc    Check if article is saved
// @route   GET /api/users/:firebaseUid/saved-articles/check/:articleId
// @access  Private
const checkArticleSaved = async (req, res) => {
  try {
    const { firebaseUid, articleId } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isSaved = user.savedArticles.some(
      article => article._id.toString() === articleId ||
        article.articleId?.toString() === articleId
    );

    res.status(200).json({
      success: true,
      isSaved
    });
  } catch (error) {
    console.error('Check saved error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error checking saved status'
    });
  }
};

// @desc    Get user's recent activity
// @route   GET /api/users/:firebaseUid/activity
// @access  Private
const getUserActivity = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { limit = 20 } = req.query;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get recent activity from user's log
    const recentActivity = (user.recentActivity || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: recentActivity.length,
      data: recentActivity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching activity'
    });
  }
};

// @desc    Get user's comments
// @route   GET /api/users/:firebaseUid/comments
// @access  Private
const getUserComments = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get comments with post info
    const comments = await Comment.find({ userId: firebaseUid })
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

    const total = await Comment.countDocuments({ userId: firebaseUid });

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
      error: 'Server error fetching comments'
    });
  }
};

// @desc    Like an article
// @route   POST /api/users/:firebaseUid/liked-articles
// @access  Private
const likeArticle = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { articleId, articleType } = req.body;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already liked
    const alreadyLiked = user.likedArticles.some(
      item => item.articleId?.toString() === articleId
    );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        error: 'Article already liked'
      });
    }

    // Add to liked articles
    user.likedArticles.push({
      articleId,
      articleType: articleType || 'article',
      likedAt: new Date()
    });

    // Add activity
    await user.addActivity('like', 'Liked an article', articleId, articleType || 'article');

    res.status(200).json({
      success: true,
      message: 'Article liked successfully',
      data: user.likedArticles
    });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error liking article'
    });
  }
};

// @desc    Unlike an article
// @route   DELETE /api/users/:firebaseUid/liked-articles/:articleId
// @access  Private
const unlikeArticle = async (req, res) => {
  try {
    const { firebaseUid, articleId } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove from liked articles
    user.likedArticles = user.likedArticles.filter(
      item => item.articleId?.toString() !== articleId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Article unliked successfully',
      data: user.likedArticles
    });
  } catch (error) {
    console.error('Unlike article error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error unliking article'
    });
  }
};

// @desc    Get user's liked articles with details
// @route   GET /api/users/:firebaseUid/liked-articles
// @access  Private
const getLikedArticles = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        data: [] // Return empty array instead of just error
      });
    }

    // Get article details for each liked article
    const SpaceMystery = require('../models/SpaceMystery');

    const likedWithDetails = await Promise.all(
      (user.likedArticles || []).map(async (item) => {
        let articleDetails = null;

        if (item.articleType === 'whatif') {
          articleDetails = await WhatIf.findById(item.articleId).select('title description imageUrl category status');
        } else {
          articleDetails = await SpaceMystery.findById(item.articleId).select('title description imageUrl category');
        }

        return {
          ...item.toObject(),
          article: articleDetails
        };
      })
    );

    // Filter out null articles (deleted ones)
    const filteredLiked = likedWithDetails.filter(item => item.article);

    res.status(200).json({
      success: true,
      count: filteredLiked.length,
      data: filteredLiked
    });
  } catch (error) {
    console.error('Get liked articles error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching liked articles'
    });
  }
};

// @desc    Get comprehensive dashboard data
// @route   GET /api/users/:firebaseUid/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get publications
    const publications = await WhatIf.find({
      authorEmail: user.email
    }).sort({ createdAt: -1 }).limit(10);

    // Get comments
    const comments = await Comment.find({ userId: firebaseUid })
      .sort({ createdAt: -1 })
      .limit(10);

    // Populate comment post info
    const commentsWithPostInfo = await Promise.all(
      comments.map(async (comment) => {
        let postTitle = 'Unknown';
        if (comment.postType === 'article') {
          const post = await BlogPost.findById(comment.postId).select('title');
          if (post) postTitle = post.title;
        } else if (comment.postType === 'whatif') {
          const theory = await WhatIf.findById(comment.postId).select('title');
          if (theory) postTitle = theory.title;
        }
        return { ...comment.toObject(), postTitle };
      })
    );

    // Get stats
    const publicationsCount = await WhatIf.countDocuments({ authorEmail: user.email });
    const approvedCount = await WhatIf.countDocuments({ authorEmail: user.email, status: 'approved' });
    const pendingCount = await WhatIf.countDocuments({ authorEmail: user.email, status: 'pending' });
    const commentsCount = await Comment.countDocuments({ userId: firebaseUid });

    res.status(200).json({
      success: true,
      data: {
        user: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          bio: user.bio,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        stats: {
          publicationsCount,
          approvedCount,
          pendingCount,
          savedCount: user.savedArticles.length,
          commentsCount,
          likedArticlesCount: user.likedArticles?.length || 0
        },
        publications,
        comments: commentsWithPostInfo,
        savedArticles: user.savedArticles.slice(0, 10),
        recentActivity: (user.recentActivity || []).slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching dashboard data'
    });
  }
};

module.exports = {
  authenticateUser,
  getUserProfile,
  updateUserProfile,
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  getUserPublications,
  getUserStats,
  checkArticleSaved,
  getUserActivity,
  getUserComments,
  likeArticle,
  unlikeArticle,
  getLikedArticles,
  getDashboardData
};
