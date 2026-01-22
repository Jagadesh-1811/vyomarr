const SpaceMystery = require('../models/SpaceMystery');
const { insertImages } = require('../services/insertImages');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Create a new space mystery (admin only)
const createMystery = async (req, res) => {
    try {
        const { title, category, categoryLabel, description, subHeading, author, readTime, status, youtubeEmbed, scheduledFor } = req.body;

        if (!title || !category || !categoryLabel || !description) {
            return res.status(400).json({ error: 'Title, category, categoryLabel, and description are required' });
        }

        let imageUrl = null;
        let imagePublicId = null;
        let images = [];

        // Handle thumbnail (single image)
        if (req.files && req.files.image && req.files.image[0]) {
            try {
                const result = await uploadToCloudinary(req.files.image[0].buffer, 'vyomarr-mysteries');
                imageUrl = result.secure_url;
                imagePublicId = result.public_id;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
            }
        }

        // Handle additional images with descriptions
        if (req.files && req.files.images) {
            // Parse image descriptions from request body
            let imageDescriptions = [];
            try {
                imageDescriptions = req.body.imageDescriptions ? JSON.parse(req.body.imageDescriptions) : [];
            } catch (e) {
                console.log('No image descriptions provided or invalid JSON');
            }

            for (let i = 0; i < req.files.images.length; i++) {
                const file = req.files.images[i];
                try {
                    const result = await uploadToCloudinary(file.buffer, 'vyomarr-mysteries');
                    images.push({
                        url: result.secure_url,
                        publicId: result.public_id,
                        description: imageDescriptions[i] || ''
                    });
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                }
            }
        }

        // Determine status and scheduledFor based on input
        let finalStatus = status || 'published';
        let finalScheduledFor = null;

        if (scheduledFor) {
            const scheduleDate = new Date(scheduledFor);
            if (scheduleDate > new Date()) {
                // Future date - schedule the article
                finalStatus = 'scheduled';
                finalScheduledFor = scheduleDate;
            }
            // If date is in the past, just publish immediately
        }

        // Insert images into the description at word‑based positions
        const imageUrls = images.map(img => img.url);
        const finalDescription = insertImages(description, imageUrls);
        const newMystery = new SpaceMystery({
            title,
            category,
            categoryLabel,
            description: finalDescription,
            subHeading: subHeading || '',
            imageUrl,
            imagePublicId,
            images,
            youtubeEmbed,
            author: author || 'Vyomarr Team',
            readTime: readTime || '5 min read',
            status: finalStatus,
            scheduledFor: finalScheduledFor
        });

        await newMystery.save();
        res.status(201).json({ success: true, message: 'Space Mystery created!', data: newMystery });
    } catch (error) {
        console.error('Error creating mystery:', error);
        res.status(500).json({ error: 'Server Error during mystery creation' });
    }
};

// Get all published mysteries (public)
const getPublishedMysteries = async (req, res) => {
    try {
        const mysteries = await SpaceMystery.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(mysteries);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch mysteries' });
    }
};

// Get all mysteries for admin (including drafts)
const getAllMysteries = async (req, res) => {
    try {
        const mysteries = await SpaceMystery.find().sort({ createdAt: -1 });
        res.json(mysteries);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch mysteries' });
    }
};

// Get single mystery by ID
const getMysteryById = async (req, res) => {
    try {
        const mystery = await SpaceMystery.findById(req.params.id);
        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        // Increment views
        mystery.views += 1;
        await mystery.save();

        res.json(mystery);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch mystery' });
    }
};

// Update a mystery (admin)
const updateMystery = async (req, res) => {
    try {
        const { title, category, categoryLabel, description, subHeading, youtubeEmbed, author, readTime, status, images } = req.body;

        const mystery = await SpaceMystery.findById(req.params.id);
        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        // Handle new image upload
        if (req.file) {
            try {
                // Delete old image if exists
                if (mystery.imagePublicId) {
                    await deleteFromCloudinary(mystery.imagePublicId);
                }
                // Upload new image
                const result = await uploadToCloudinary(req.file.buffer, 'vyomarr-mysteries');
                mystery.imageUrl = result.secure_url;
                mystery.imagePublicId = result.public_id;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
            }
        }

        // Update fields
        if (title) mystery.title = title;
        if (category) mystery.category = category;
        if (categoryLabel) mystery.categoryLabel = categoryLabel;
        if (description !== undefined) mystery.description = description;
        if (subHeading !== undefined) mystery.subHeading = subHeading;
        if (youtubeEmbed !== undefined) mystery.youtubeEmbed = youtubeEmbed;
        if (author) mystery.author = author;
        if (readTime) mystery.readTime = readTime;
        if (status) mystery.status = status;

        // Update images array (for descriptions)
        if (images && Array.isArray(images)) {
            mystery.images = images;
        }

        await mystery.save();
        res.json({ success: true, data: mystery, message: 'Mystery updated successfully' });
    } catch (error) {
        console.error('Error updating mystery:', error);
        res.status(500).json({ error: 'Could not update mystery' });
    }
};

// Delete a mystery (admin)
const deleteMystery = async (req, res) => {
    try {
        const mystery = await SpaceMystery.findById(req.params.id);
        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        // Delete image from Cloudinary if exists
        if (mystery.imagePublicId) {
            try {
                await deleteFromCloudinary(mystery.imagePublicId);
            } catch (e) {
                console.error('Error deleting image:', e);
            }
        }

        await SpaceMystery.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Mystery deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete mystery' });
    }
};

// Toggle publish status
const togglePublish = async (req, res) => {
    try {
        const mystery = await SpaceMystery.findById(req.params.id);
        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        mystery.status = mystery.status === 'published' ? 'draft' : 'published';
        mystery.scheduledFor = null; // Clear any scheduled time
        await mystery.save();

        res.json({ success: true, data: mystery, message: `Mystery ${mystery.status}` });
    } catch (error) {
        res.status(500).json({ error: 'Could not toggle mystery status' });
    }
};

// Get all scheduled mysteries (admin only)
const getScheduledMysteries = async (req, res) => {
    try {
        const mysteries = await SpaceMystery.find({ status: 'scheduled' }).sort({ scheduledFor: 1 });
        res.json(mysteries);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch scheduled mysteries' });
    }
};

// Update schedule time for a mystery
const updateSchedule = async (req, res) => {
    try {
        const { scheduledFor } = req.body;
        const mystery = await SpaceMystery.findById(req.params.id);

        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        if (!scheduledFor) {
            return res.status(400).json({ error: 'scheduledFor is required' });
        }

        const scheduleDate = new Date(scheduledFor);
        if (scheduleDate <= new Date()) {
            return res.status(400).json({ error: 'Scheduled time must be in the future' });
        }

        mystery.scheduledFor = scheduleDate;
        mystery.status = 'scheduled';
        await mystery.save();

        res.json({ success: true, data: mystery, message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Could not update schedule' });
    }
};

// Publish a scheduled mystery immediately
const publishNow = async (req, res) => {
    try {
        const mystery = await SpaceMystery.findById(req.params.id);

        if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

        mystery.status = 'published';
        mystery.scheduledFor = null;
        await mystery.save();

        res.json({ success: true, data: mystery, message: 'Article published successfully' });
    } catch (error) {
        console.error('Error publishing mystery:', error);
        res.status(500).json({ error: 'Could not publish mystery' });
    }
};

module.exports = {
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
};
