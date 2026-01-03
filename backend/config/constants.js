module.exports = {
    // --- USER ROLES ---
    ROLES: {
        ADMIN: 'admin',
        HR: 'hr',
        EMPLOYEE: 'employee',
        MANAGER: 'manager'
    },

    // --- FINANCIAL CONSTANTS (Based on Wireframe) ---
    SALARY_CONFIG: {
        PF_RATE: 0.12,          // 12% of Basic
        PROFESSIONAL_TAX: 200,  // Fixed Amount
        BASIC_PERCENTAGE: 0.50, // 50% of Wage
        HRA_PERCENTAGE: 0.50,   // 50% of Basic
        STD_ALLOWANCE: 4167,    // Fixed Amount
        BONUS_RATE: 0.0833,     // 8.33% of Basic
        LTA_RATE: 0.0833        // 8.33% of Basic
    },

    // --- ATTENDANCE CONFIGURATION ---
    ATTENDANCE_STATUS: {
        PRESENT: 'Present',
        ABSENT: 'Absent',
        HALF_DAY: 'Half Day',
        ON_DUTY: 'On Duty',
        PAID_LEAVE: 'Paid Leave',
        HOLIDAY: 'Holiday'
    },

    WORK_HOURS: {
        FULL_DAY_THRESHOLD: 8, // Minimum hours for "Present"
        HALF_DAY_THRESHOLD: 4  // Minimum hours for "Half Day"
    },

    // --- LEAVE TYPES ---
    LEAVE_TYPES: {
        SICK: 'Sick Leave',
        CASUAL: 'Casual Leave',
        EARNED: 'Earned Leave',
        UNPAID: 'Unpaid Leave',
        MATERNITY: 'Maternity Leave'
    },

    LEAVE_STATUS: {
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected'
    },

    // --- PAYROLL STATUS ---
    PAYROLL_STATUS: {
        PROCESSED: 'Processed',
        PAID: 'Paid',
        HELD: 'Held'
    }
};