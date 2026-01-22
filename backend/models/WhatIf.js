// WhatIf model schema
const mongoose = require('mongoose');

const WhatIfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  authorName: { type: String },
  authorEmail: { type: String, required: true },
  firebaseUid: { type: String, index: true },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  reviewedAt: { type: Date },
  images: [{
    url: String,
    publicId: String,
    description: String
  }],
  votes: { type: Number, default: 0 },
  votedBy: [{ type: String }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WhatIf', WhatIfSchema);
