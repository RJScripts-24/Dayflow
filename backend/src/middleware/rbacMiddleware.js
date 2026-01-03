const { HTTP_STATUS } = require('../../config/constants');
const logger = require('../../config/logger');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'User authentication failed'
            });
        }

        if (!roles.includes(req.user.role)) {
            logger.warn(`RBAC Denied: User ${req.user.id} [${req.user.role}] attempted to access restricted route`);
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: `Access denied. Authorized roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = authorize;