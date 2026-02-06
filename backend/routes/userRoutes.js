const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  getUserProfile,
  updateUserProfile,
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  getUserPublications,
  getUserStats,
  checkArticleSaved,
  checkArticleLiked,
  getUserActivity,
  getUserComments,
  likeArticle,
  unlikeArticle,
  getLikedArticles,
  getDashboardData
} = require('../controllers/userController');

// Authentication - Create or get user on login
router.post('/auth', authenticateUser);

// Profile routes
router.get('/profile/:firebaseUid', getUserProfile);
router.put('/profile/:firebaseUid', updateUserProfile);

// Dashboard - Get comprehensive data
router.get('/:firebaseUid/dashboard', getDashboardData);

// Saved articles routes
router.get('/:firebaseUid/saved-articles', getSavedArticles);
router.post('/:firebaseUid/saved-articles', saveArticle);
router.delete('/:firebaseUid/saved-articles/:articleId', unsaveArticle);
router.get('/:firebaseUid/saved-articles/check/:articleId', checkArticleSaved);

// Publications routes
router.get('/:firebaseUid/publications', getUserPublications);

// Comments routes
router.get('/:firebaseUid/comments', getUserComments);

// Activity routes
router.get('/:firebaseUid/activity', getUserActivity);

// Liked articles routes
router.get('/:firebaseUid/liked-articles', getLikedArticles);
router.get('/:firebaseUid/liked-articles/check/:articleId', checkArticleLiked);
router.post('/:firebaseUid/liked-articles', likeArticle);
router.delete('/:firebaseUid/liked-articles/:articleId', unlikeArticle);

// Stats route
router.get('/:firebaseUid/stats', getUserStats);

module.exports = router;
