const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');

// @route   POST /api/contact
// @desc    Submit a new contact message (public)
// @access  Public
router.post('/', submitContact);

// @route   GET /api/contact
// @desc    Get all contact messages (admin)
// @access  Admin
router.get('/', getAllContacts);

// @route   GET /api/contact/stats
// @desc    Get contact statistics (admin)
// @access  Admin
router.get('/stats', getContactStats);

// @route   GET /api/contact/:id
// @desc    Get single contact by ID (admin)
// @access  Admin
router.get('/:id', getContactById);

// @route   PUT /api/contact/:id
// @desc    Update contact status (admin)
// @access  Admin
router.put('/:id', updateContactStatus);

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (admin)
// @access  Admin
router.delete('/:id', deleteContact);

module.exports = router;
