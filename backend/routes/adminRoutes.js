const express = require('express');
const router = express.Router();
const { singleImageUpload } = require('../middleware/upload');
const {
  getAllTheories,
  approveTheory,
  rejectTheory,
  deleteTheory
} = require('../controllers/whatIfController');

// @route   GET /api/admin/whatif
// @desc    Get all theories for admin (including pending)
// @access  Admin (should be protected in production)
router.get('/whatif', getAllTheories);

// @route   PATCH /api/admin/whatif/:id/approve
// @desc    Approve a theory
// @access  Admin (should be protected in production)
router.patch('/whatif/:id/approve', approveTheory);

// @route   PATCH /api/admin/whatif/:id/reject
// @desc    Reject a theory
// @access  Admin (should be protected in production)
router.patch('/whatif/:id/reject', rejectTheory);

// @route   DELETE /api/admin/whatif/:id
// @desc    Delete a theory
// @access  Admin (should be protected in production)
router.delete('/whatif/:id', deleteTheory);

module.exports = router;
