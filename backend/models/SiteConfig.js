const mongoose = require('mongoose');

const SiteConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g. 'home_hero'
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible JSON structure
        default: {}
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
