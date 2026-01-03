const UserModel = require('../models/userModel');
const LeaveModel = require('../models/leaveModel');
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
        const emailMessage = `
            Hello ${firstName},
            
            Welcome to the team! Your account has been created.
            
            Here are your login details:
            Employee ID: ${employeeId}
            Temporary Password: ${tempPassword}
            
            Please login and change your password immediately.
            
            Regards,
            HR Team
        `;

        await sendEmail({
            email: newUser.email,
            subject: emailSubject,
            message: emailMessage
        });

        res.status(201).json({
            message: 'User created successfully and email sent.',
            user: {
                id: employeeId,
                name: `${firstName} ${lastName}`,
                email: email,
                role: newUser.role
            }
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

module.exports = {
    createUser,
    getAllUsers,
    respondToLeave
};