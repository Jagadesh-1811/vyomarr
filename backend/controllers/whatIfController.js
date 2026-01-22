const WhatIf = require('../models/WhatIf');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { sendEmail, emailTemplates } = require('../config/email');
const { insertImages } = require('../services/insertImages');

// Submit a new theory (public)
const submitTheory = async (req, res) => {
  try {
    const { title, category, description, authorName, authorEmail, firebaseUid } = req.body;

    if (!title || !description || !authorEmail) {
      return res.status(400).json({ error: 'Title, description, and email are required' });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // Handle multiple image uploads and legacy single image
    let images = [];
    let imageUrls = [];
    // If multiple images are sent as 'images' field
    if (req.files && req.files.images) {
      let imageDescriptions = [];
      try {
        imageDescriptions = req.body.imageDescriptions ? JSON.parse(req.body.imageDescriptions) : [];
      } catch (e) {
        console.log('No image descriptions provided or invalid JSON');
      }
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        try {
          const result = await uploadToCloudinary(file.buffer, 'vyomarr-whatif');
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
            description: imageDescriptions[i] || ''
          });
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }
    // Legacy single image handling (if no multiple images and req.file present)
    if (req.file && !imageUrl) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'vyomarr-whatif');
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Legacy image upload error:', uploadError);
      }
    }

    const newTheory = new WhatIf({
      title,
      category: category || 'Other',
      // Insert images into description at word‑based positions
      description: insertImages(description, imageUrls),
      authorName: authorName || 'Anonymous',
      authorEmail: authorEmail.toLowerCase(),
      firebaseUid,
      imageUrl,
      imagePublicId,
      images,
      status: 'pending'
    });

    await newTheory.save();

    // If user is logged in, update their profile
    if (firebaseUid) {
      const user = await User.findOne({ firebaseUid });
      if (user) {
        user.publications.push(newTheory._id);
        user.stats.publicationsCount = (user.stats.publicationsCount || 0) + 1;
        user.stats.pendingCount = (user.stats.pendingCount || 0) + 1;

        // Add to activity log
        await user.addActivity(
          'publish',
          `Submitted a new What If theory: "${title}"`,
          newTheory._id,
          'whatif'
        );
      }
    }

    res.status(201).json({ success: true, message: 'Theory submitted for review!', data: newTheory });
  } catch (error) {
    console.error('Error submitting theory:', error);
    res.status(500).json({ error: 'Server Error during theory submission' });
  }
};

// Get all approved theories (public)
const getApprovedTheories = async (req, res) => {
  try {
    const theories = await WhatIf.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theories' });
  }
};

// Get user's own theories by email
const getUserTheories = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const theories = await WhatIf.find({ authorEmail: email }).sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch user theories' });
  }
};

// Get all theories for admin (including pending)
const getAllTheories = async (req, res) => {
  try {
    const theories = await WhatIf.find().sort({ createdAt: -1 });
    res.json(theories);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theories' });
  }
};

// Get single theory by ID
const getTheoryById = async (req, res) => {
  try {
    const theory = await WhatIf.findById(req.params.id);
    if (!theory) return res.status(404).json({ error: 'Theory not found' });
    res.json(theory);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch theory' });
  }
};

// Approve a theory (admin)
const approveTheory = async (req, res) => {
  try {
    const theory = await WhatIf.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedAt: new Date(), rejectionReason: null },
      { new: true }
    );
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Send approval email
    await sendEmail(
      theory.authorEmail,
      '🎉 Your Vyomarr Theory Has Been Approved!',
      emailTemplates.theoryApproved(theory)
    );

    res.json({ success: true, data: theory, message: 'Theory approved and user notified' });
  } catch (error) {
    console.error('Error approving theory:', error);
    res.status(500).json({ error: 'Could not approve theory' });
  }
};

// Reject a theory (admin)
const rejectTheory = async (req, res) => {
  try {
    const { reason } = req.body;

    const theory = await WhatIf.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedAt: new Date(), rejectionReason: reason || 'No reason provided' },
      { new: true }
    );
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Send rejection email
    await sendEmail(
      theory.authorEmail,
      'Vyomarr Theory Review Update',
      emailTemplates.theoryRejected(theory)
    );

    res.json({ success: true, data: theory, message: 'Theory rejected and user notified' });
  } catch (error) {
    console.error('Error rejecting theory:', error);
    res.status(500).json({ error: 'Could not reject theory' });
  }
};

// Delete a theory (admin)
const deleteTheory = async (req, res) => {
  try {
    const theory = await WhatIf.findById(req.params.id);
    if (!theory) return res.status(404).json({ error: 'Theory not found' });

    // Delete image from Cloudinary if exists
    if (theory.imagePublicId) {
      await deleteFromCloudinary(theory.imagePublicId);
    }

    await WhatIf.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Theory deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete theory' });
  }
};

module.exports = {
  submitTheory,
  getApprovedTheories,
  getUserTheories,
  getAllTheories,
  getTheoryById,
  approveTheory,
  rejectTheory,
  deleteTheory
};
