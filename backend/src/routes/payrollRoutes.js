const express = require('express');
const router = express.Router();
const {
    processPayroll,
    getAllPayrolls,
    getPayrollByEmployee,
    updatePaymentStatus,
    downloadSlip,
    calculateSalaryOnDemand,
    generateSlipOnDemand
} = require('../controllers/payrollController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('admin', 'hr', 'manager'), getAllPayrolls)
    .post(authorize('admin', 'hr'), processPayroll);

router.post('/calculate', authorize('admin', 'hr', 'manager'), calculateSalaryOnDemand);

router.post('/generate-slip', authorize('admin', 'hr', 'manager'), generateSlipOnDemand);

router.get('/employee/:employeeId', authorize('admin', 'hr', 'manager'), getPayrollByEmployee);

router.get('/download/:id', downloadSlip);

router.put('/:id/status', authorize('admin', 'hr'), updatePaymentStatus);

module.exports = router;