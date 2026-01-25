require('dotenv').config();
const mongoose = require('mongoose');
const SuperAdmin = require('../models/SuperAdmin');
const { connectDB } = require('../config/db');

// Connect to DB
connectDB();

const seedAdmin = async () => {
    try {
        const adminEmail = 'mohanreddysaigovindu@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error('❌ Error: ADMIN_PASSWORD environment variable is required.');
            process.exit(1);
        }

        // Check if admin already exists
        const exists = await SuperAdmin.findOne({ email: adminEmail });

        if (exists) {
            console.log('Admin account already exists.');
            // Optional: Update password if needed
            // exists.password = adminPassword;
            // await exists.save();
            // console.log('Admin password updated.');
            process.exit();
        }

        // Create new admin
        const admin = new SuperAdmin({
            email: adminEmail,
            password: adminPassword
        });

        await admin.save();
        console.log('Super Admin account created successfully!');
        process.exit();

    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
