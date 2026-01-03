const db = require('../../config/db.config');

/**
 * Leave Model - Manages leave records using raw MySQL queries
 */
const LeaveModel = {
    /**
     * Create a new leave request
     * @param {Object} leaveData
     * @returns {Promise<Object>}
     */
    create: async (leaveData) => {
        const sql = `
            INSERT INTO leaves 
            (employeeId, leaveType, startDate, endDate, reason, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            leaveData.employeeId,
            leaveData.leaveType,
            leaveData.startDate,
            leaveData.endDate,
            leaveData.reason,
            leaveData.status || 'Pending'
        ];
        
        const [result] = await db.execute(sql, values);
        return { insertId: result.insertId, ...leaveData };
    },

    /**
     * Find leave by ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    findById: async (id) => {
        const sql = `SELECT * FROM leaves WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    /**
     * Find all leaves for an employee
     * @param {string} employeeId
     * @returns {Promise<Array>}
     */
    findByEmployee: async (employeeId) => {
        const sql = `
            SELECT * FROM leaves 
            WHERE employeeId = ?
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(sql, [employeeId]);
        return rows;
    },

    /**
     * Find all pending leave requests
     * @returns {Promise<Array>}
     */
    findPending: async () => {
        const sql = `
            SELECT l.*, u.firstName, u.lastName, u.email, u.department 
            FROM leaves l
            JOIN users u ON l.employeeId = u.id
            WHERE l.status = 'Pending'
            ORDER BY l.created_at ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Update leave status
     * @param {number} leaveId
     * @param {string} status
     * @param {string} adminResponse
     * @returns {Promise<Object>}
     */
    updateStatus: async (leaveId, status, adminResponse = null) => {
        const sql = `
            UPDATE leaves 
            SET status = ?, adminResponse = ?, updated_at = NOW()
            WHERE id = ?
        `;
        await db.execute(sql, [status, adminResponse, leaveId]);
        return { id: leaveId, status, adminResponse };
    },

    /**
     * Find all leaves
     * @returns {Promise<Array>}
     */
    findAll: async () => {
        const sql = `
            SELECT l.*, u.firstName, u.lastName, u.email, u.department 
            FROM leaves l
            JOIN users u ON l.employeeId = u.id
            ORDER BY l.created_at DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
};

module.exports = LeaveModel;