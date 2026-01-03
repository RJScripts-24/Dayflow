const fs = require('fs');
const path = require('path');
const PayrollModel = require('../models/payrollModel');
const UserModel = require('../models/userModel');
const AttendanceModel = require('../models/attendanceModel');
const { calculateSalaryStructure } = require('../services/salaryEngine');
const { calculatePayableDays } = require('../services/attendanceCalculator');
const { generateSalarySlip } = require('../services/pdfService');
const { getMonthRange } = require('../utils/dateHelpers');

/**
 * @desc    Run Payroll for a specific month
 * @route   POST /api/payroll/process
 * @access  Private (Admin/HR)
 */
const processPayroll = async (req, res) => {
    try {
        const { month, year } = req.body; // e.g., month: 1 (Jan), year: 2026

        if (!month || !year) {
            return res.status(400).json({ message: 'Please provide month and year' });
        }

        // 1. Get Date Range for the month (to fetch attendance)
        const { start, end } = getMonthRange(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();

        // 2. Fetch all active employees
        const employees = await UserModel.findAllActive();
        
        const processedResults = [];

        // 3. Loop through each employee and calculate
        for (const emp of employees) {
            // A. Fetch Attendance Records
            const attendanceRecords = await AttendanceModel.findByDateRange(emp.id, start, end);
            
            // B. Calculate Payable Days (Present + Leaves + Holidays)
            // Note: In a real app, you'd also fetch approved paid leaves and holidays here
            const payableDays = calculatePayableDays(attendanceRecords);
            
            // C. Get Standard Salary Structure (Based on full month)
            const standardStructure = calculateSalaryStructure(emp.wage);

            // D. Calculate Pro-rated Earnings (Loss of Pay Logic)
            // Formula: (Component / DaysInMonth) * PayableDays
            const proRationFactor = payableDays / daysInMonth;

            const finalBasic = standardStructure.components.basic * proRationFactor;
            const finalHRA = standardStructure.components.hra * proRationFactor;
            const finalSpecial = standardStructure.components.fixedAllowance * proRationFactor;
            const finalLTA = standardStructure.components.lta * proRationFactor;
            const finalBonus = standardStructure.components.performanceBonus * proRationFactor;
            const finalStdAllowance = standardStructure.components.standardAllowance * proRationFactor;

            // E. Calculate Deductions (PF is usually on earned basic)
            const finalPF = finalBasic * 0.12; 
            const finalPT = 200; // Fixed
            const totalDeductions = finalPF + finalPT;

            const netPay = (finalBasic + finalHRA + finalSpecial + finalLTA + finalBonus + finalStdAllowance) - totalDeductions;

            // F. Create Payroll Record Object
            const payrollData = {
                employeeId: emp.id,
                month,
                year,
                totalDays: daysInMonth,
                payableDays,
                basic: finalBasic,
                hra: finalHRA,
                allowances: finalSpecial + finalLTA + finalBonus + finalStdAllowance,
                deductions: totalDeductions,
                netSalary: netPay,
                status: 'Processed'
            };

            // G. Save to Database
            const savedPayroll = await PayrollModel.create(payrollData);

            // H. Generate PDF Slip
            const pdfFilename = `SalarySlip_${emp.id}_${month}_${year}.pdf`;
            const pdfData = {
                companyName: 'Dayflow Systems',
                employeeName: `${emp.firstName} ${emp.lastName}`,
                employeeId: emp.id,
                department: emp.department,
                month: `${month}/${year}`,
                payableDays,
                ...payrollData
            };

            await generateSalarySlip(pdfData, pdfFilename);

            processedResults.push({
                employee: emp.email,
                netPay: netPay.toFixed(2),
                status: 'Success'
            });
        }

        res.status(200).json({
            message: 'Payroll processing completed',
            results: processedResults
        });

    } catch (error) {
        console.error('Payroll Process Error:', error);
        res.status(500).json({ message: 'Server error processing payroll' });
    }
};

/**
 * @desc    Get All Payroll Records (History)
 * @route   GET /api/payroll/history
 * @access  Private (Admin/HR)
 */
const getAllPayrolls = async (req, res) => {
    try {
        const { month, year } = req.query;
        let payrolls;

        if (month && year) {
            payrolls = await PayrollModel.findByMonth(month, year);
        } else {
            payrolls = await PayrollModel.findAll();
        }

        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get My Payroll History
 * @route   GET /api/payroll/my-history
 * @access  Private (Employee)
 */
const getMyPayroll = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const payrolls = await PayrollModel.findByEmployee(employeeId);
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Download Salary Slip PDF
 * @route   GET /api/payroll/download/:id
 * @access  Private (Owner/Admin)
 */
const downloadSlip = async (req, res) => {
    try {
        const payrollId = req.params.id;
        const payroll = await PayrollModel.findById(payrollId);

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        // Authorization check
        if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.id !== payroll.employee_id) {
            return res.status(403).json({ message: 'Not authorized to view this slip' });
        }

        const filename = `SalarySlip_${payroll.employee_id}_${payroll.month}_${payroll.year}.pdf`;
        const filePath = path.join(__dirname, '../../public/exports', filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            // Regenerate if missing (Optional resilience feature)
            res.status(404).json({ message: 'Slip file not found on server' });
        }

    } catch (error) {
        console.error('Download Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    processPayroll,
    getAllPayrolls,
    getMyPayroll,
    downloadSlip
};