const User = require('../models/User');
const Room = require('../models/Room');
const { HTTP_STATUS } = require('../config/constants');
const logger = require('../config/logger');

const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRooms = await Room.countDocuments();
        const activeRooms = await Room.countDocuments({ 'users.0': { $exists: true } });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: {
                totalUsers,
                totalRooms,
                activeRooms
            }
        });
    } catch (error) {
        logger.error(`Admin Stats Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve system statistics'
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        logger.error(`Fetch Users Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve users'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(id);
        logger.info(`User deleted by admin: ${id}`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'User successfully deleted'
        });
    } catch (error) {
        logger.error(`Delete User Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({})
            .sort({ createdAt: -1 });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        logger.error(`Fetch Rooms Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve rooms'
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Room not found'
            });
        }

        await Room.findOneAndDelete({ roomId });
        logger.info(`Room force-closed by admin: ${roomId}`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Room successfully deleted'
        });
    } catch (error) {
        logger.error(`Delete Room Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete room'
        });
    }
};

module.exports = {
    getSystemStats,
    getAllUsers,
    deleteUser,
    getAllRooms,
    deleteRoom
};