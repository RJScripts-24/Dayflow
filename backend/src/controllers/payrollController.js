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
            const grossEarnings = finalBasic + finalHRA + finalSpecial + finalLTA + finalBonus + finalStdAllowance;
            const pdfData = {
                companyName: 'Dayflow Systems',
                employeeName: `${emp.firstName} ${emp.lastName}`,
                employeeId: emp.id,
                department: emp.department || 'N/A',
                month: `${month}/${year}`,
                totalDays: daysInMonth,
                payableDays,
                basic: finalBasic.toFixed(2),
                hra: finalHRA.toFixed(2),
                allowances: (finalSpecial + finalLTA + finalBonus + finalStdAllowance).toFixed(2),
                grossEarnings: grossEarnings.toFixed(2),
                pfDeduction: finalPF.toFixed(2),
                ptDeduction: finalPT.toFixed(2),
                deductions: totalDeductions.toFixed(2),
                netSalary: netPay.toFixed(2),
                generatedDate: new Date().toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                })
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
        if (req.user.role !== 'admin' && req.user.role !== 'hr' && req.user.id !== payroll.employeeId) {
            return res.status(403).json({ message: 'Not authorized to view this slip' });
        }

        const filename = `SalarySlip_${payroll.employeeId}_${payroll.month}_${payroll.year}.pdf`;
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

/**
 * @desc    Get payroll by employee ID
 * @route   GET /api/payroll/employee/:employeeId
 * @access  Private (Admin/HR/Manager)
 */
const getPayrollByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const payrolls = await PayrollModel.findByEmployee(employeeId);
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update payment status
 * @route   PUT /api/payroll/:id/status
 * @access  Private (Admin/HR)
 */
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentDate } = req.body;

        await PayrollModel.updatePaymentStatus(id, status, paymentDate);
        
        res.status(200).json({ 
            message: 'Payment status updated successfully',
            status 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Calculate salary for employee based on attendance (on-demand)
 * @route   POST /api/payroll/calculate
 * @access  Private (Admin/HR/Manager)
 */
const calculateSalaryOnDemand = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        if (!employeeId || !month || !year) {
            return res.status(400).json({ message: 'Please provide employeeId, month, and year' });
        }

        // 1. Get employee details
        const employee = await UserModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // 2. Get Date Range for the month
        const { start, end } = getMonthRange(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();

        // 3. Fetch Attendance Records
        const attendanceRecords = await AttendanceModel.findByDateRange(employeeId, start, end);
        
        // 4. Calculate Payable Days
        const payableDays = calculatePayableDays(attendanceRecords);
        
        // 5. Get Standard Salary Structure
        const standardStructure = calculateSalaryStructure(employee.wage);

        // 6. Calculate Pro-rated Earnings
        const proRationFactor = payableDays / daysInMonth;

        const finalBasic = standardStructure.components.basic * proRationFactor;
        const finalHRA = standardStructure.components.hra * proRationFactor;
        const finalSpecial = standardStructure.components.fixedAllowance * proRationFactor;
        const finalLTA = standardStructure.components.lta * proRationFactor;
        const finalBonus = standardStructure.components.performanceBonus * proRationFactor;
        const finalStdAllowance = standardStructure.components.standardAllowance * proRationFactor;

        // 7. Calculate Deductions
        const finalPF = finalBasic * 0.12; 
        const finalPT = 200; // Fixed
        const totalDeductions = finalPF + finalPT;

        const grossEarnings = finalBasic + finalHRA + finalSpecial + finalLTA + finalBonus + finalStdAllowance;
        const netPay = grossEarnings - totalDeductions;

        // 8. Return calculation (without saving to DB)
        res.status(200).json({
            employee: {
                id: employee.id,
                name: `${employee.firstName} ${employee.lastName}`,
                department: employee.department,
                designation: employee.designation,
                wage: employee.wage
            },
            period: {
                month,
                year,
                totalDays: daysInMonth,
                payableDays
            },
            earnings: {
                basic: parseFloat(finalBasic.toFixed(2)),
                hra: parseFloat(finalHRA.toFixed(2)),
                fixedAllowance: parseFloat(finalSpecial.toFixed(2)),
                lta: parseFloat(finalLTA.toFixed(2)),
                performanceBonus: parseFloat(finalBonus.toFixed(2)),
                standardAllowance: parseFloat(finalStdAllowance.toFixed(2)),
                gross: parseFloat(grossEarnings.toFixed(2))
            },
            deductions: {
                pf: parseFloat(finalPF.toFixed(2)),
                pt: parseFloat(finalPT.toFixed(2)),
                total: parseFloat(totalDeductions.toFixed(2))
            },
            netSalary: parseFloat(netPay.toFixed(2)),
            attendanceRecords: attendanceRecords.length
        });

    } catch (error) {
        console.error('Calculate Salary Error:', error);
        res.status(500).json({ message: 'Server error calculating salary' });
    }
};

/**
 * @desc    Generate and download salary slip on-demand
 * @route   POST /api/payroll/generate-slip
 * @access  Private (Admin/HR/Manager)
 */
const generateSlipOnDemand = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        if (!employeeId || !month || !year) {
            return res.status(400).json({ message: 'Please provide employeeId, month, and year' });
        }

        // 1. Get employee details
        const employee = await UserModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // 2. Get Date Range for the month
        const { start, end } = getMonthRange(year, month);
        const daysInMonth = new Date(year, month, 0).getDate();

        // 3. Fetch Attendance Records
        const attendanceRecords = await AttendanceModel.findByDateRange(employeeId, start, end);
        
        // 4. Calculate Payable Days
        const payableDays = calculatePayableDays(attendanceRecords);
        
        // 5. Get Standard Salary Structure
        const standardStructure = calculateSalaryStructure(employee.wage);

        // 6. Calculate Pro-rated Earnings
        const proRationFactor = payableDays / daysInMonth;

        const finalBasic = standardStructure.components.basic * proRationFactor;
        const finalHRA = standardStructure.components.hra * proRationFactor;
        const finalSpecial = standardStructure.components.fixedAllowance * proRationFactor;
        const finalLTA = standardStructure.components.lta * proRationFactor;
        const finalBonus = standardStructure.components.performanceBonus * proRationFactor;
        const finalStdAllowance = standardStructure.components.standardAllowance * proRationFactor;

        // 7. Calculate Deductions
        const finalPF = finalBasic * 0.12; 
        const finalPT = 200;
        const totalDeductions = finalPF + finalPT;

        const grossEarnings = finalBasic + finalHRA + finalSpecial + finalLTA + finalBonus + finalStdAllowance;
        const netPay = grossEarnings - totalDeductions;

        // 8. Generate PDF
        const pdfFilename = `SalarySlip_${employee.id}_${month}_${year}.pdf`;
        const pdfData = {
            companyName: 'Dayflow Systems',
            employeeName: `${employee.firstName} ${employee.lastName}`,
            employeeId: employee.id,
            department: employee.department || 'N/A',
            month: `${month}/${year}`,
            totalDays: daysInMonth,
            payableDays,
            basic: finalBasic.toFixed(2),
            hra: finalHRA.toFixed(2),
            allowances: (finalSpecial + finalLTA + finalBonus + finalStdAllowance).toFixed(2),
            grossEarnings: grossEarnings.toFixed(2),
            pfDeduction: finalPF.toFixed(2),
            ptDeduction: finalPT.toFixed(2),
            deductions: totalDeductions.toFixed(2),
            netSalary: netPay.toFixed(2),
            generatedDate: new Date().toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            })
        };

        await generateSalarySlip(pdfData, pdfFilename);

        // 9. Send the PDF file
        const filePath = path.join(__dirname, '../../public/exports', pdfFilename);
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, pdfFilename, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    res.status(500).json({ message: 'Error downloading file' });
                }
            });
        } else {
            res.status(404).json({ message: 'Generated file not found' });
        }

    } catch (error) {
        console.error('Generate Slip Error:', error);
        res.status(500).json({ message: 'Server error generating salary slip' });
    }
};

module.exports = {
    processPayroll,
    getAllPayrolls,
    getMyPayroll,
    downloadSlip,
    getPayrollByEmployee,
    updatePaymentStatus,
    calculateSalaryOnDemand,
    generateSlipOnDemand
};