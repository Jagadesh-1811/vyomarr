const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
} = require('../controllers/feedbackController');

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', submitFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback (for admin dashboard)
// @access  Public (should be protected in production)
router.get('/', getAllFeedback);

// @route   GET /api/feedback/:id
// @desc    Get single feedback by ID
// @access  Public (should be protected in production)
router.get('/:id', getFeedbackById);

// @route   PATCH /api/feedback/:id
// @desc    Update feedback status
// @access  Public (should be protected in production)
router.patch('/:id', updateFeedbackStatus);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Public (should be protected in production)
router.delete('/:id', deleteFeedback);

module.exports = router;
