const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { HTTP_STATUS } = require('../config/constants');
const logger = require('../config/logger');

const processPayroll = async (req, res) => {
    try {
        const { employeeId, payPeriod, basicSalary, allowances, deductions, paymentDate } = req.body;

        if (!employeeId || !payPeriod || !basicSalary) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Employee ID, pay period, and basic salary are required'
            });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if payroll already exists for this period
        const existingPayroll = await Payroll.findOne({ employee: employeeId, payPeriod });
        if (existingPayroll) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Payroll for this period already exists'
            });
        }

        const totalAllowances = allowances || 0;
        const totalDeductions = deductions || 0;
        const netSalary = basicSalary + totalAllowances - totalDeductions;

        const payroll = await Payroll.create({
            employee: employeeId,
            payPeriod,
            basicSalary,
            allowances: totalAllowances,
            deductions: totalDeductions,
            netSalary,
            paymentDate: paymentDate || new Date(),
            status: 'Processed'
        });

        logger.info(`Payroll processed for Employee ID: ${employeeId}, Period: ${payPeriod}`);

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: payroll
        });
    } catch (error) {
        logger.error(`Process Payroll Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to process payroll'
        });
    }
};

const getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find({})
            .populate('employee', 'firstName lastName email position')
            .sort({ paymentDate: -1 });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            count: payrolls.length,
            data: payrolls
        });
    } catch (error) {
        logger.error(`Fetch All Payrolls Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve payroll records'
        });
    }
};

const getPayrollByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const payrolls = await Payroll.find({ employee: employeeId })
            .sort({ paymentDate: -1 });

        if (!payrolls || payrolls.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'No payroll records found for this employee'
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            count: payrolls.length,
            data: payrolls
        });
    } catch (error) {
        logger.error(`Fetch Employee Payroll Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve employee payroll history'
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Processed', 'Paid'].includes(status)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Invalid status provided'
            });
        }

        const payroll = await Payroll.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!payroll) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        logger.info(`Payroll status updated: ${id} to ${status}`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: payroll
        });
    } catch (error) {
        logger.error(`Update Payroll Status Error: ${error.message}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update payment status'
        });
    }
};

module.exports = {
    processPayroll,
    getAllPayrolls,
    getPayrollByEmployee,
    updatePaymentStatus
};