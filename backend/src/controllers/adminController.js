const UserModel = require('../models/userModel');
const LeaveModel = require('../models/leaveModel');
const AttendanceModel = require('../models/attendanceModel');
const { generateNextId } = require('../services/idGenerator');
const { hashPassword, generateTempPassword } = require('../utils/passwordHelper');
const sendEmail = require('../utils/emailSender');

/**
 * @desc    Create a new User/Employee
 * @route   POST /api/admin/create-user
 * @access  Private (Admin only)
 */
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role, department, designation, wage, joinDate } = req.body;

        // 1. Check if user already exists
        const userExists = await UserModel.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 2. Generate Custom Employee ID (e.g., EMP20260001)
        const lastUser = await UserModel.getLastId(); 
        const lastId = lastUser ? lastUser.id : null;
        const employeeId = generateNextId(lastId);

        // 3. Generate and Hash Temporary Password
        const tempPassword = generateTempPassword();
        const hashedPassword = await hashPassword(tempPassword);

        console.log('🔐 Generated credentials for new employee:');
        console.log('   Employee ID:', employeeId);
        console.log('   Temp Password:', tempPassword);
        console.log('   Password Length:', tempPassword.length);

        // 4. Create User Object
        const newUser = {
            id: employeeId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'employee',
            department,
            designation,
            wage: wage || 0, // Base wage for Salary Engine
            joinDate: joinDate || new Date()
        };

        // 5. Save to Database
        await UserModel.create(newUser);

        // 6. Send Welcome Email with Credentials
        const emailSubject = 'Welcome to Dayflow - Your Login Credentials';
        const emailMessage = `Hello ${firstName},

Welcome to the team! Your account has been created.

Here are your login details:
Employee ID: ${employeeId}
Temporary Password: ${tempPassword}

Please login and change your password immediately.

Regards,
HR Team`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #512DA8;">Welcome to Dayflow!</h2>
                <p>Hello ${firstName},</p>
                <p>Welcome to the team! Your account has been created.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Employee ID:</strong> ${employeeId}</p>
                    <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                </div>
                <p>Please login and change your password immediately.</p>
                <p>Regards,<br>HR Team</p>
            </div>
        `;

        let emailSent = false;
        try {
            await sendEmail({
                email: newUser.email,
                subject: emailSubject,
                message: emailMessage,
                html: emailHtml
            });
            emailSent = true;
            console.log(`✅ Email sent successfully to ${newUser.email}`);
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError.message);
            // Don't fail the entire request if email fails
        }

        res.status(201).json({
            message: emailSent 
                ? 'User created successfully and email sent.' 
                : `User created successfully, but email failed to send. Temporary password: ${tempPassword}`,
            user: {
                id: employeeId,
                name: `${firstName} ${lastName}`,
                email: email,
                role: newUser.role
            },
            tempPassword: !emailSent ? tempPassword : undefined // Only show if email failed
        });

    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Approve or Reject Leave Request
 * @route   PUT /api/admin/leave/:id
 * @access  Private (Admin only)
 */
const respondToLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { status, adminResponse } = req.body; // status: 'Approved' or 'Rejected'

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Use Approved or Rejected.' });
        }

        const updatedLeave = await LeaveModel.updateStatus(leaveId, status, adminResponse);

        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Optional: Send email notification to employee about the decision
        // const employee = await UserModel.findById(updatedLeave.employeeId);
        // await sendEmail(...)

        res.status(200).json({
            message: `Leave request ${status}`,
            data: updatedLeave
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getSystemStats = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        const leaves = await LeaveModel.findAll();
        
        res.status(200).json({
            totalUsers: users.length,
            totalLeaves: leaves.length,
            pendingLeaves: leaves.filter(l => l.status === 'Pending').length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.delete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get all rooms (placeholder for future implementation)
 * @route   GET /api/admin/rooms
 * @access  Private (Admin only)
 */
const getAllRooms = async (req, res) => {
    res.status(200).json({ message: 'Rooms feature not yet implemented', rooms: [] });
};

/**
 * @desc    Delete room (placeholder for future implementation)
 * @route   DELETE /api/admin/rooms/:roomId
 * @access  Private (Admin only)
 */
const deleteRoom = async (req, res) => {
    res.status(200).json({ message: 'Rooms feature not yet implemented' });
};

/**
 * @desc    Get all attendance records for today
 * @route   GET /api/admin/attendance
 * @access  Private (Admin only)
 */
const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await AttendanceModel.getAllToday();
        
        // Format the response
        const formattedRecords = attendanceRecords.map(record => ({
            id: record.id,
            employeeId: record.employeeId,
            employeeName: `${record.firstName} ${record.lastName}`,
            email: record.email,
            date: record.date,
            checkIn: record.check_in_time,
            checkOut: record.check_out_time,
            workHours: record.work_hours,
            status: record.status
        }));
        
        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Server error fetching attendance' });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    respondToLeave,
    getSystemStats,
    deleteUser,
    getAllRooms,
    deleteRoom,
    getAllAttendance
};