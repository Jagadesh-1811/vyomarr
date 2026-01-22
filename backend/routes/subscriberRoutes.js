const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
  unsubscribe
} = require('../controllers/subscriberController');

// @route   POST /api/subscribe
// @desc    Subscribe a new user
// @access  Public
router.post('/', subscribe);

// @route   GET /api/subscribers
// @desc    Get all subscribers (for admin dashboard)
// @access  Public (should be protected in production)
router.get('/', getAllSubscribers);

// @route   DELETE /api/subscribers/:id
// @desc    Delete subscriber
// @access  Public (should be protected in production)
router.delete('/:id', deleteSubscriber);

// @route   PATCH /api/subscribers/:id/unsubscribe
// @desc    Unsubscribe (deactivate)
// @access  Public
router.patch('/:id/unsubscribe', unsubscribe);

module.exports = router;
