const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  attachment: { type: String }, // URL to uploaded file if any
  status: { type: String, enum: ['new', 'read', 'replied', 'resolved'], default: 'new' },
  adminNotes: { type: String },
  repliedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', ContactSchema);
