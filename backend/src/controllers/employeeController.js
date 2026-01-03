const UserModel = require('../models/userModel');
const AttendanceModel = require('../models/attendanceModel');
const LeaveModel = require('../models/leaveModel');
const { calculateWorkHours, determineAttendanceStatus } = require('../services/attendanceCalculator');

/**
 * @desc    Get current employee profile
 * @route   GET /api/emp/profile
 * @access  Private (Employee)
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive data
        delete user.password;

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Mark Attendance (Check-in / Check-out)
 * @route   POST /api/emp/attendance
 * @access  Private (Employee)
 */
const markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const now = new Date();

        // 1. Check if an entry already exists for today
        const existingRecord = await AttendanceModel.findByDate(userId, today);

        if (!existingRecord) {
            // --- SCENARIO A: CHECK-IN ---
            await AttendanceModel.createCheckIn(userId, today, now);
            
            return res.status(201).json({
                message: 'Checked in successfully',
                checkInTime: now,
                status: 'Present' // Default status
            });

        } else if (existingRecord.check_out_time === null) {
            // --- SCENARIO B: CHECK-OUT ---
            // Calculate duration immediately
            const checkInTime = new Date(existingRecord.check_in_time);
            const workHours = calculateWorkHours(checkInTime, now);
            const status = determineAttendanceStatus(workHours);

            await AttendanceModel.updateCheckOut(existingRecord.id, now, workHours, status);

            return res.status(200).json({
                message: 'Checked out successfully',
                checkInTime: existingRecord.check_in_time,
                checkOutTime: now,
                workHours: workHours,
                status: status
            });

        } else {
            // --- SCENARIO C: ALREADY COMPLETED ---
            return res.status(400).json({ 
                message: 'Attendance for today is already completed.' 
            });
        }

    } catch (error) {
        console.error('Attendance Error:', error);
        res.status(500).json({ message: 'Server error marking attendance' });
    }
};

/**
 * @desc    View Personal Attendance History
 * @route   GET /api/emp/attendance/history
 * @access  Private (Employee)
 */
const getAttendanceHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query; // Optional filters

        let history;
        if (month && year) {
            history = await AttendanceModel.findByMonth(userId, month, year);
        } else {
            // Default: Last 30 days
            history = await AttendanceModel.getRecent(userId, 30);
        }

        res.status(200).json(history);
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};

/**
 * @desc    Apply for Leave
 * @route   POST /api/emp/leave
 * @access  Private (Employee)
 */
const applyForLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validation
        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newLeave = {
            employeeId: userId,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending'
        };

        const result = await LeaveModel.create(newLeave);

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leaveId: result.insertId
        });

    } catch (error) {
        console.error('Leave Application Error:', error);
        res.status(500).json({ message: 'Server error submitting leave' });
    }
};

module.exports = {
    getProfile,
    markAttendance,
    getAttendanceHistory,
    applyForLeave
};