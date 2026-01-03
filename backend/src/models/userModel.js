const db = require('../../config/db.config');

/**
 * User Model - Manages user/employee records using raw MySQL queries
 */
const UserModel = {
    /**
     * Find user by email
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    findByEmail: async (email) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0] || null;
    },

    /**
     * Find user by ID
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    findById: async (id) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    /**
     * Find all users
     * @returns {Promise<Array>}
     */
    findAll: async () => {
        const sql = `SELECT id, firstName, lastName, email, role, department, designation, wage, joinDate, isActive FROM users ORDER BY createdAt DESC`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Find all active employees
     * @returns {Promise<Array>}
     */
    findAllActive: async () => {
        const sql = `SELECT * FROM users WHERE isActive = true AND role != 'admin'`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Get last user ID for ID generation
     * @returns {Promise<Object|null>}
     */
    getLastId: async () => {
        const sql = `SELECT id FROM users ORDER BY id DESC LIMIT 1`;
        const [rows] = await db.execute(sql);
        return rows[0] || null;
    },

    /**
     * Create a new user
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    create: async (userData) => {
        const sql = `
            INSERT INTO users 
            (id, firstName, lastName, email, password, role, department, designation, wage, joinDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            userData.id,
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password,
            userData.role || 'employee',
            userData.department,
            userData.designation,
            userData.wage || 0,
            userData.joinDate || new Date()
        ];
        
        await db.execute(sql, values);
        return userData;
    },

    /**
     * Update user password
     * @param {string} userId
     * @param {string} hashedPassword
     * @returns {Promise<void>}
     */
    updatePassword: async (userId, hashedPassword) => {
        const sql = `UPDATE users SET password = ? WHERE id = ?`;
        await db.execute(sql, [hashedPassword, userId]);
    },

    /**
     * Update user details
     * @param {string} userId
     * @param {Object} updateData
     * @returns {Promise<void>}
     */
    update: async (userId, updateData) => {
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (fields.length === 0) return;
        
        values.push(userId);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        await db.execute(sql, values);
    },

    /**
     * Delete user
     * @param {string} userId
     * @returns {Promise<void>}
     */
    delete: async (userId) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        await db.execute(sql, [userId]);
    }
};

module.exports = UserModel;