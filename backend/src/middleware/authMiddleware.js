const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { HTTP_STATUS, JWT_SECRET } = require('../../config/constants');
const logger = require('../../config/logger');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from the token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Not authorized, user not found'
                });
            }

            // Remove password before attaching to request
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;

            next();
        } catch (error) {
            logger.error(`Auth Middleware Error: ${error.message}`);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
        next();
    } else {
        res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};

module.exports = {
    protect,
    admin
};