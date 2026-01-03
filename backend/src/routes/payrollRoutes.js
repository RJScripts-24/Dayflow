const express = require('express');
const router = express.Router();
const {
    processPayroll,
    getAllPayrolls,
    getPayrollByEmployee,
    updatePaymentStatus
} = require('../controllers/payrollController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.use(protect);

router.route('/')
    .get(authorize('admin', 'hr', 'manager'), getAllPayrolls)
    .post(authorize('admin', 'hr'), processPayroll);

router.get('/employee/:employeeId', authorize('admin', 'hr', 'manager'), getPayrollByEmployee);

router.put('/:id/status', authorize('admin', 'hr'), updatePaymentStatus);

module.exports = router;