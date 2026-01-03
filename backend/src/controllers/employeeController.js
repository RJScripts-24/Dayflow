const Employee = require('../models/Employee');
const { HTTP_STATUS } = require('../config/constants');
const logger = require('../config/logger');

const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, position, department, salary } = req.body;

        if (!firstName || !lastName || !email || !position) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        const employee = await Employee.create({
            firstName,
            lastName,
            email,
            position,
            department,
            salary
        });

        logger.info(`New employee created: ${email}`);

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: employee
        });
    } catch (error) {
        logger.error(`Create Employee Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create employee'
        });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).sort({ createdAt: -1 });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        logger.error(`Fetch Employees Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve employees'
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: employee
        });
    } catch (error) {
        logger.error(`Fetch Employee By ID Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve employee details'
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        let employee = await Employee.findById(id);

        if (!employee) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        employee = await Employee.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        logger.info(`Employee updated: ${id}`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: employee
        });
    } catch (error) {
        logger.error(`Update Employee Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update employee'
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await Employee.findByIdAndDelete(id);
        logger.info(`Employee deleted: ${id}`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Employee successfully deleted'
        });
    } catch (error) {
        logger.error(`Delete Employee Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete employee'
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};