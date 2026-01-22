const express = require('express');
const router = express.Router();
const { singleImageUpload } = require('../middleware/upload');
const {
  submitTheory,
  getApprovedTheories,
  getUserTheories,
  getTheoryById
} = require('../controllers/whatIfController');

// @route   POST /api/whatif
// @desc    Submit a new theory (public)
// @access  Public
router.post('/', singleImageUpload, submitTheory);

// @route   GET /api/whatif
// @desc    Get all approved theories (public)
// @access  Public
router.get('/', getApprovedTheories);

// @route   GET /api/whatif/user/:email
// @desc    Get user's own theories by email
// @access  Public
router.get('/user/:email', getUserTheories);

// @route   GET /api/whatif/:id
// @desc    Get single theory by ID
// @access  Public
router.get('/:id', getTheoryById);

module.exports = router;
