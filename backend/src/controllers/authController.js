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
 * @desc    Register a new user (self-registration)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await UserModel.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate employee ID
        const { generateNextId } = require('../services/idGenerator');
        const lastUser = await UserModel.getLastId();
        // Use different prefix for admin IDs
        let employeeId;
        if (role === 'admin') {
            employeeId = generateNextId(lastUser ? lastUser.id : null, 'ADMIN');
        } else {
            employeeId = generateNextId(lastUser ? lastUser.id : null);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        // Only allow valid roles
        const allowedRoles = ['admin', 'hr', 'employee'];
        let userRole = 'employee';
        if (role && allowedRoles.includes(role)) {
            userRole = role;
        }
        const newUser = {
            id: employeeId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: userRole,
            department: null,
            designation: null,
            wage: 0,
            joinDate: new Date()
        };

        await UserModel.create(newUser);

        // Generate token
        const token = generateToken(employeeId, newUser.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: employeeId,
                name: `${firstName} ${lastName}`,
                email: email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
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
    registerUser,
    loginUser,
    changePassword,
    getMe
};