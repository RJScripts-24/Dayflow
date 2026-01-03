const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS, JWT_SECRET } = require('../config/constants');
const logger = require('../config/logger');

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                data: {
                    _id: user.id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        logger.error(`Register Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: {
                    _id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        logger.error(`Login Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error(`Auth Check Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};