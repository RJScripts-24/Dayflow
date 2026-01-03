const db = require('../../config/db.config');

/**
 * Attendance Model - Manages attendance records using raw MySQL queries
 */
const AttendanceModel = {
    /**
     * Find attendance record by date
     * @param {string} employeeId
     * @param {string} date - Format: YYYY-MM-DD
     * @returns {Promise<Object|null>}
     */
    findByDate: async (employeeId, date) => {
        const sql = `SELECT * FROM attendance WHERE employeeId = ? AND date = ?`;
        const [rows] = await db.execute(sql, [employeeId, date]);
        return rows[0] || null;
    },

    /**
     * Create check-in record
     * @param {string} employeeId
     * @param {string} date
     * @param {Date} checkInTime
     * @returns {Promise<Object>}
     */
    createCheckIn: async (employeeId, date, checkInTime) => {
        const sql = `
            INSERT INTO attendance (employeeId, date, check_in_time, status) 
            VALUES (?, ?, ?, 'Present')
        `;
        const [result] = await db.execute(sql, [employeeId, date, checkInTime]);
        return { id: result.insertId, employeeId, date, check_in_time: checkInTime };
    },

    /**
     * Update check-out time and work hours
     * @param {number} recordId
     * @param {Date} checkOutTime
     * @param {number} workHours
     * @param {string} status
     * @returns {Promise<void>}
     */
    updateCheckOut: async (recordId, checkOutTime, workHours, status) => {
        const sql = `
            UPDATE attendance 
            SET check_out_time = ?, work_hours = ?, status = ?
            WHERE id = ?
        `;
        await db.execute(sql, [checkOutTime, workHours, status, recordId]);
    },

    /**
     * Find attendance records by date range
     * @param {string} employeeId
     * @param {string} startDate
     * @param {string} endDate
     * @returns {Promise<Array>}
     */
    findByDateRange: async (employeeId, startDate, endDate) => {
        const sql = `
            SELECT * FROM attendance 
            WHERE employeeId = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `;
        const [rows] = await db.execute(sql, [employeeId, startDate, endDate]);
        return rows;
    },

    /**
     * Find attendance by month
     * @param {string} employeeId
     * @param {number} month
     * @param {number} year
     * @returns {Promise<Array>}
     */
    findByMonth: async (employeeId, month, year) => {
        const sql = `
            SELECT * FROM attendance 
            WHERE employeeId = ? 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
            ORDER BY date ASC
        `;
        const [rows] = await db.execute(sql, [employeeId, month, year]);
        return rows;
    },

    /**
     * Get recent attendance records
     * @param {string} employeeId
     * @param {number} days
     * @returns {Promise<Array>}
     */
    getRecent: async (employeeId, days = 30) => {
        const sql = `
            SELECT * FROM attendance 
            WHERE employeeId = ? 
            AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY date DESC
        `;
        const [rows] = await db.execute(sql, [employeeId, days]);
        return rows;
    }
};

module.exports = AttendanceModel;