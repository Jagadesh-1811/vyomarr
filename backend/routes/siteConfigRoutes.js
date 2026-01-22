const express = require('express');
const router = express.Router();
const { singleImageUpload } = require('../middleware/upload');
const { getConfig, addHeroSlide, deleteHeroSlide, updateHeroSlide } = require('../controllers/siteConfigController');

// @route   GET /api/config/:key
// @desc    Get configuration by key
// @access  Public
router.get('/:key', getConfig);

// @route   POST /api/config/hero/slides
// @desc    Add new hero slide
// @access  Admin
router.post('/hero/slides', singleImageUpload, addHeroSlide);

// @route   PUT /api/config/hero/slides/:id
// @desc    Update existing hero slide
// @access  Admin
router.put('/hero/slides/:id', singleImageUpload, updateHeroSlide);

// @route   DELETE /api/config/hero/slides/:id
// @desc    Delete hero slide
// @access  Admin
router.delete('/hero/slides/:id', deleteHeroSlide);

module.exports = router;
