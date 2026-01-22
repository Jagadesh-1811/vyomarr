const SiteConfig = require('../models/SiteConfig');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Get generic config by key
const getConfig = async (req, res) => {
    try {
        const { key } = req.params;
        const config = await SiteConfig.findOne({ key });

        if (!config) {
            // Return default/empty if not found
            return res.json({ key, data: { slides: [] } });
        }

        res.json(config);
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Could not fetch configuration' });
    }
};

// Add New Slide
const addHeroSlide = async (req, res) => {
    try {
        const { heading, subHeading, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, alignment } = req.body;

        // Find existing config or create new
        let config = await SiteConfig.findOne({ key: 'home_hero' });
        if (!config) {
            config = new SiteConfig({ key: 'home_hero', data: { slides: [] } });
        }

        // Ensure data.slides exists. If not, check if we have legacy data to migrate.
        if (!config.data.slides) {
            if (config.data.heading) {
                // Migrate legacy data to first slide
                const legacySlide = {
                    id: 'legacy-' + Date.now(),
                    heading: config.data.heading,
                    subHeading: config.data.subHeading,
                    primaryButtonText: config.data.primaryButtonText,
                    primaryButtonLink: config.data.primaryButtonLink,
                    secondaryButtonText: config.data.secondaryButtonText,
                    secondaryButtonLink: config.data.secondaryButtonLink,
                    backgroundImageUrl: config.data.backgroundImageUrl,
                    backgroundImagePublicId: config.data.backgroundImagePublicId,
                    createdAt: config.lastUpdated || new Date()
                };
                config.data = { slides: [legacySlide] };
            } else {
                config.data = { slides: [] };
            }
        }

        const newSlide = {
            id: Date.now().toString(), // Simple ID
            heading,
            subHeading,
            primaryButtonText,
            primaryButtonLink,
            secondaryButtonText,
            secondaryButtonLink,
            alignment: alignment || 'center',
            createdAt: new Date()
        };

        // Handle Background Image Upload
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'vyomarr-site-assets');
                newSlide.backgroundImageUrl = result.secure_url;
                newSlide.backgroundImagePublicId = result.public_id;
            } catch (uploadError) {
                console.error('Hero image upload error:', uploadError);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }

        config.data.slides.push(newSlide);

        // Mark as modified mixed type
        config.markModified('data');
        config.lastUpdated = new Date();
        await config.save();

        res.json({ success: true, message: 'Slide added successfully', data: config.data });

    } catch (error) {
        console.error('Error adding slide:', error);
        res.status(500).json({ error: 'Could not add slide' });
    }
};

// Delete Slide
const deleteHeroSlide = async (req, res) => {
    try {
        const { id } = req.params;
        let config = await SiteConfig.findOne({ key: 'home_hero' });

        if (!config || !config.data.slides) {
            return res.status(404).json({ error: 'No slides found' });
        }

        const slideIndex = config.data.slides.findIndex(s => s.id === id);
        if (slideIndex === -1) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        const slide = config.data.slides[slideIndex];

        // Delete image from cloudinary
        if (slide.backgroundImagePublicId) {
            await deleteFromCloudinary(slide.backgroundImagePublicId);
        }

        config.data.slides.splice(slideIndex, 1);
        config.markModified('data');
        await config.save();

        res.json({ success: true, message: 'Slide deleted successfully', data: config.data });

    } catch (error) {
        console.error('Error deleting slide:', error);
        res.status(500).json({ error: 'Could not delete slide' });
    }
};


// Update Slide
const updateHeroSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, subHeading, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, alignment } = req.body;

        let config = await SiteConfig.findOne({ key: 'home_hero' });

        if (!config || !config.data.slides) {
            return res.status(404).json({ error: 'No slides found' });
        }

        const slideIndex = config.data.slides.findIndex(s => s.id === id);
        if (slideIndex === -1) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        const slide = config.data.slides[slideIndex];

        // Update fields
        if (heading) slide.heading = heading;
        if (subHeading) slide.subHeading = subHeading;
        if (primaryButtonText) slide.primaryButtonText = primaryButtonText;
        if (primaryButtonLink) slide.primaryButtonLink = primaryButtonLink;
        if (secondaryButtonText) slide.secondaryButtonText = secondaryButtonText;
        if (secondaryButtonLink) slide.secondaryButtonLink = secondaryButtonLink;
        if (alignment) slide.alignment = alignment;

        // Handle Background Image Update
        if (req.file) {
            try {
                // Delete old image if exists
                if (slide.backgroundImagePublicId) {
                    await deleteFromCloudinary(slide.backgroundImagePublicId);
                }

                const result = await uploadToCloudinary(req.file.buffer, 'vyomarr-site-assets');
                slide.backgroundImageUrl = result.secure_url;
                slide.backgroundImagePublicId = result.public_id;
            } catch (uploadError) {
                console.error('Hero image upload error:', uploadError);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }

        // Save back
        config.data.slides[slideIndex] = slide;
        config.markModified('data');
        config.lastUpdated = new Date();
        await config.save();

        res.json({ success: true, message: 'Slide updated successfully', data: config.data });

    } catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({ error: 'Could not update slide' });
    }
};

module.exports = {
    getConfig,
    addHeroSlide,
    deleteHeroSlide,
    updateHeroSlide
};
