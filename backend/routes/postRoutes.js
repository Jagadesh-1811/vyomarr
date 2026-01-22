const express = require('express');
const router = express.Router();
const { postUpload } = require('../middleware/upload');
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment
} = require('../controllers/postController');

// @route   POST /api/posts
// @desc    Create a new blog post
// @access  Public (should be protected in production)
router.post('/', postUpload, createPost);

// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', getAllPosts);

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id', getPostById);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Public (should be protected in production)
router.delete('/:id', deletePost);

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Public
router.post('/:id/like', likePost);

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Public
router.post('/:id/comments', addComment);

// @route   DELETE /api/posts/:postId/comments/:commentId
// @desc    Delete a comment from a post
// @access  Public (should be protected in production)
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;
