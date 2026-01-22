const express = require('express');
const router = express.Router();
const { getAllComments: getAllCommentsFromPosts } = require('../controllers/postController');
const {
  addComment,
  getPostComments,
  getUserComments,
  toggleCommentLike,
  editComment,
  deleteComment,
  getAllComments
} = require('../controllers/commentController');

// @route   GET /api/comments
// @desc    Get all comments from all posts (for admin dashboard)
// @access  Public (should be protected in production)
router.get('/', getAllComments);

// @route   GET /api/comments/legacy
// @desc    Get all comments from embedded post comments (legacy)
// @access  Admin
router.get('/legacy', getAllCommentsFromPosts);

// @route   POST /api/comments
// @desc    Add a new comment
// @access  Public
router.post('/', addComment);

// @route   GET /api/comments/post/:postId
// @desc    Get comments for a specific post
// @access  Public
router.get('/post/:postId', getPostComments);

// @route   GET /api/comments/user/:userId
// @desc    Get all comments by a user
// @access  Private
router.get('/user/:userId', getUserComments);

// @route   POST /api/comments/:commentId/like
// @desc    Like/unlike a comment
// @access  Private
router.post('/:commentId/like', toggleCommentLike);

// @route   PUT /api/comments/:commentId
// @desc    Edit a comment
// @access  Private
router.put('/:commentId', editComment);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:commentId', deleteComment);

module.exports = router;
