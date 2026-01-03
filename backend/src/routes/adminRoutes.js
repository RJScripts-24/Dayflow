const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getSystemStats,
    getAllUsers,
    createUser,
    deleteUser,
    getAllRooms,
    deleteRoom,
    respondToLeave,
    getAllAttendance,
    getAllLeaves
} = require('../controllers/adminController');

// All routes in this file are protected and require admin privileges
router.use(protect);
router.use(admin);

// System Statistics
router.get('/stats', getSystemStats);

// User Management
router.post('/create-user', createUser);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Leave Management
router.get('/leaves', getAllLeaves);
router.put('/leave/:leaveId', respondToLeave);

// Attendance Management
router.get('/attendance', getAllAttendance);

// Room Management (Syncode context)
router.get('/rooms', getAllRooms);
router.delete('/rooms/:roomId', deleteRoom);

module.exports = router;