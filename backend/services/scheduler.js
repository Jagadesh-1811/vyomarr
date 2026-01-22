const cron = require('node-cron');
const SpaceMystery = require('../models/SpaceMystery');

/**
 * Article Scheduler Service
 * Runs every minute to check for scheduled articles that need to be published
 */

const checkAndPublish = async () => {
    try {
        const now = new Date();
        console.log(`🔍 [Scheduler] Checking at ${now.toISOString()}`);

        // Find articles that are scheduled and their publish time has passed
        const articlesToPublish = await SpaceMystery.find({
            status: 'scheduled',
            scheduledFor: { $lte: now }
        });

        console.log(`📊 [Scheduler] Found ${articlesToPublish.length} article(s) to publish`);

        if (articlesToPublish.length > 0) {
            for (const article of articlesToPublish) {
                console.log(`📄 [Scheduler] Publishing: "${article.title}" (scheduled for: ${article.scheduledFor})`);
                article.status = 'published';
                article.updatedAt = now;
                await article.save();
                console.log(`✅ [Scheduler] Published: "${article.title}"`);
            }
        }
    } catch (error) {
        console.error('❌ [Scheduler] Error:', error.message);
    }
};

const startScheduler = () => {
    console.log('📅 Article Scheduler started - checking every minute for scheduled posts');

    // Run immediately on startup to catch any pending articles
    checkAndPublish();

    // Then run every minute
    cron.schedule('* * * * *', checkAndPublish);
};

module.exports = { startScheduler };

