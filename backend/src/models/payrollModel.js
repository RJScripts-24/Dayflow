const db = require('../../config/db.config');

/**
 * Payroll Model - Manages payroll records using raw MySQL queries
 */
const PayrollModel = {
    /**
     * Create a new payroll record
     * @param {Object} data - Payroll data
     * @returns {Promise<Object>}
     */
    create: async (data) => {
        const sql = `
            INSERT INTO payrolls 
            (employeeId, month, year, totalDays, payableDays, basic, hra, allowances, deductions, netSalary, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            data.employeeId,
            data.month,
            data.year,
            data.totalDays,
            data.payableDays,
            data.basic,
            data.hra,
            data.allowances,
            data.deductions,
            data.netSalary,
            data.status || 'Processed'
        ];
        
        const [result] = await db.execute(sql, values);
        return { insertId: result.insertId, ...data };
    },

    /**
     * Find all payroll records
     * @returns {Promise<Array>}
     */
    findAll: async () => {
        const sql = `
            SELECT p.*, u.firstName, u.lastName, u.email, u.department 
            FROM payrolls p
            JOIN users u ON p.employeeId = u.id
            ORDER BY p.year DESC, p.month DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Find payroll records by month and year
     * @param {number} month
     * @param {number} year
     * @returns {Promise<Array>}
     */
    findByMonth: async (month, year) => {
        const sql = `
            SELECT p.*, u.firstName, u.lastName, u.email, u.department 
            FROM payrolls p
            JOIN users u ON p.employeeId = u.id
            WHERE p.month = ? AND p.year = ?
            ORDER BY u.firstName ASC
        `;
        const [rows] = await db.execute(sql, [month, year]);
        return rows;
    },

    /**
     * Find payroll records by employee ID
     * @param {string} employeeId
     * @returns {Promise<Array>}
     */
    findByEmployee: async (employeeId) => {
        const sql = `
            SELECT * FROM payrolls 
            WHERE employeeId = ?
            ORDER BY year DESC, month DESC
        `;
        const [rows] = await db.execute(sql, [employeeId]);
        return rows;
    },

    /**
     * Find payroll record by ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    findById: async (id) => {
        const sql = `SELECT * FROM payrolls WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    /**
     * Update payroll payment status
     * @param {number} id
     * @param {string} status
     * @param {Date} paymentDate
     * @returns {Promise<Object>}
     */
    updatePaymentStatus: async (id, status, paymentDate = new Date()) => {
        const sql = `
            UPDATE payrolls 
            SET status = ?, paymentDate = ?
            WHERE id = ?
        `;
        await db.execute(sql, [status, paymentDate, id]);
        return { id, status, paymentDate };
    },

    /**
     * Check if payroll exists for employee in a specific month/year
     * @param {string} employeeId
     * @param {number} month
     * @param {number} year
     * @returns {Promise<boolean>}
     */
    exists: async (employeeId, month, year) => {
        const sql = `
            SELECT COUNT(*) as count 
            FROM payrolls 
            WHERE employeeId = ? AND month = ? AND year = ?
        `;
        const [rows] = await db.execute(sql, [employeeId, month, year]);
        return rows[0].count > 0;
    }
};

module.exports = PayrollModel;
