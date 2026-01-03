const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.route('/')
    .get(protect, authorize('admin', 'hr', 'manager'), getEmployees)
    .post(protect, authorize('admin', 'hr'), createEmployee);

router.route('/:id')
    .get(protect, authorize('admin', 'hr', 'manager'), getEmployeeById)
    .put(protect, authorize('admin', 'hr'), updateEmployee)
    .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;