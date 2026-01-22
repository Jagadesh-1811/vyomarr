const express = require('express');
const router = express.Router();
const { spaceUpload } = require('../middleware/upload');
const {
    createMystery,
    getPublishedMysteries,
    getAllMysteries,
    getMysteryById,
    updateMystery,
    deleteMystery,
    togglePublish,
    getScheduledMysteries,
    updateSchedule,
    publishNow
} = require('../controllers/spaceMysteryController');

// @route   GET /api/spacemysteries
// @desc    Get all published mysteries (public)
// @access  Public
router.get('/', getPublishedMysteries);

// ============ ADMIN ROUTES ============
// NOTE: Admin routes MUST come before /:id route to avoid matching issues

// @route   GET /api/spacemysteries/admin/all
// @desc    Get all mysteries for admin (including drafts)
// @access  Admin
router.get('/admin/all', getAllMysteries);

// @route   GET /api/spacemysteries/admin/scheduled
// @desc    Get all scheduled mysteries for admin
// @access  Admin
router.get('/admin/scheduled', getScheduledMysteries);

// @route   POST /api/spacemysteries
// @desc    Create a new mystery (admin)
// @access  Admin
router.post('/', spaceUpload, createMystery);

// @route   GET /api/spacemysteries/:id
// @desc    Get single mystery by ID
// @access  Public
router.get('/:id', getMysteryById);

// @route   PUT /api/spacemysteries/:id
// @desc    Update a mystery (admin)
// @access  Admin
router.put('/:id', spaceUpload, updateMystery);

// @route   PATCH /api/spacemysteries/:id/toggle
// @desc    Toggle publish/draft status (admin)
// @access  Admin
router.patch('/:id/toggle', togglePublish);

// @route   PATCH /api/spacemysteries/:id/schedule
// @desc    Update schedule time for a mystery (admin)
// @access  Admin
router.patch('/:id/schedule', updateSchedule);

// @route   PATCH /api/spacemysteries/:id/publish-now
// @desc    Publish a scheduled mystery immediately (admin)
// @access  Admin
router.patch('/:id/publish-now', publishNow);

// @route   DELETE /api/spacemysteries/:id
// @desc    Delete a mystery (admin)
// @access  Admin
router.delete('/:id', deleteMystery);

module.exports = router;

