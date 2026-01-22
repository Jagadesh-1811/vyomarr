const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subCategory: { type: String },
  title: { type: String, required: true },
  subHeading: { type: String },
  content: { type: String, required: true },
  youtubeEmbed: { type: String },
  thumbnail: {
    url: { type: String },
    publicId: { type: String }
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [{
    name: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
