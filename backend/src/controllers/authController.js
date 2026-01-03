const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { matchPassword, hashPassword } = require('../utils/passwordHelper');

// Helper to generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email exists
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Check if password matches
        const isMatch = await matchPassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Generate Token
        const token = generateToken(user.id, user.role);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                department: user.department,
                avatar: user.avatar // Assuming avatar path is stored
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

/**
 * @desc    Change Password (Required for first-time login)
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // From authMiddleware

        // 1. Get current user password hash
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Verify Old Password
        const isMatch = await matchPassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // 3. Hash New Password
        const hashedPassword = await hashPassword(newPassword);

        // 4. Update in Database
        await UserModel.updatePassword(userId, hashedPassword);

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data without password
        const { password, ...userData } = user;
        
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginUser,
    changePassword,
    getMe
};