const mongoose = require('mongoose');

const SpaceMysterySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    categoryLabel: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subHeading: {
        type: String
    },
    imageUrl: {
        type: String
    },
    imagePublicId: {
        type: String
    },
    images: [
        {
            url: String,
            publicId: String,
            description: String
        }
    ],
    youtubeEmbed: {
        type: String
    },
    author: {
        type: String,
        default: 'Vyomarr Team'
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published'],
        default: 'published'
    },
    scheduledFor: {
        type: Date,
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
SpaceMysterySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('SpaceMystery', SpaceMysterySchema);
