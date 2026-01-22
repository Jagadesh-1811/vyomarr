const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { name, email, userType, overallRating, feedbackAreas, likes, improvements, features } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      userType,
      overallRating,
      feedbackAreas,
      likes,
      improvements,
      features,
      status: 'pending'
    });

    await newFeedback.save();
    res.status(201).json({ success: true, message: 'Feedback submitted successfully!', data: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server Error during feedback submission' });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch feedback' });
  }
};

// Get single feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch feedback' });
  }
};

// Update feedback status
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ error: 'Could not update feedback' });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete feedback' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
};
