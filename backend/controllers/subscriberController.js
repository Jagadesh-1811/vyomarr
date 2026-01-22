const Subscriber = require('../models/Subscriber');

// Subscribe a new user
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ error: 'Email is already subscribed' });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        return res.status(200).json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
      }
    }

    const newSubscriber = new Subscriber({
      email: email.toLowerCase(),
    });

    await newSubscriber.save();
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email is already subscribed' });
    }
    res.status(500).json({ error: 'Server Error during subscription' });
  }
};

// Get all subscribers
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch subscribers' });
  }
};

// Delete subscriber
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ success: true, message: 'Subscriber removed' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete subscriber' });
  }
};

// Unsubscribe (deactivate)
const unsubscribe = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not unsubscribe' });
  }
};

module.exports = {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
  unsubscribe
};
