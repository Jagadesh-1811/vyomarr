const SuperAdmin = require('../models/SuperAdmin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Auth Super Admin & get token
 * @route   POST /api/admin/login
 * @access  Public
 */
const authAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await SuperAdmin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            // Update last login
            admin.lastLogin = Date.now();
            await admin.save();

            const token = generateToken(admin._id);

            // Send token in HTTP-only cookie
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.json({
                _id: admin._id,
                email: admin.email,
                token: token, // Also sending token in response for flexibility
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Reset Password with Default OTP
 * @route   POST /api/admin/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const ALLOWED_EMAIL = 'mohanreddysaigovindu@gmail.com';

    try {
        // 1. Strict Email Check
        if (email !== ALLOWED_EMAIL) {
            return res.status(403).json({ message: 'Password reset not allowed for this account' });
        }

        // 2. Verify OTP
        const DEFAULT_OTP = process.env.DEFAULT_ADMIN_OTP || '98234';
        if (otp !== DEFAULT_OTP) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // 3. Find Admin & Update Password
        const admin = await SuperAdmin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin account not found' });
        }

        admin.password = newPassword; // Will be hashed by pre-save hook
        await admin.save();

        res.status(200).json({ message: 'Password reset successful. Please login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Logout admin / clear cookie
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logoutAdmin = (req, res) => {
    res.cookie('adminToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    authAdmin,
    resetPassword,
    logoutAdmin,
};
