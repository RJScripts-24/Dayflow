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
    },

    /**
     * Get all attendance records for today (Admin view)
     * @returns {Promise<Array>}
     */
    getAllToday: async () => {
        const sql = `
            SELECT 
                a.id,
                a.employeeId,
                a.date,
                a.check_in_time,
                a.check_out_time,
                a.work_hours,
                a.status,
                u.firstName,
                u.lastName,
                u.email
            FROM attendance a
            LEFT JOIN users u ON a.employeeId = u.id
            WHERE a.date = CURDATE()
            ORDER BY a.check_in_time DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
};

module.exports = AttendanceModel;

// sentinel generated
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required'],
        index: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in time is required']
    },
    checkOut: {
        type: Date,
        validate: {
            validator: function(value) {
                // Check-out must be after check-in if provided
                return !value || value > this.checkIn;
            },
            message: 'Check-out time must be after check-in time'
        }
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day', 'on-leave'],
        default: 'present'
    },
    totalHours: {
        type: Number,
        min: 0,
        max: 24,
        default: 0
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Virtual for calculating total hours if checkOut exists
attendanceSchema.virtual('calculatedHours').get(function() {
    if (this.checkIn && this.checkOut) {
        const diffMs = this.checkOut - this.checkIn;
        return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
    }
    return 0;
});

// Pre-save middleware to calculate totalHours
attendanceSchema.pre('save', function(next) {
    if (this.checkIn && this.checkOut) {
        const diffMs = this.checkOut - this.checkIn;
        this.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    }
    next();
});

// Static method to find attendance by employee and date range
attendanceSchema.statics.findByEmployeeAndDateRange = function(employeeId, startDate, endDate) {
    return this.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate },
        isActive: true
    }).sort({ date: 1 });
};

// Static method to mark attendance as inactive (soft delete)
attendanceSchema.statics.softDelete = function(attendanceId) {
    return this.findByIdAndUpdate(
        attendanceId,
        { isActive: false },
        { new: true }
    );
};

// Instance method to check if attendance is complete
attendanceSchema.methods.isComplete = function() {
    return !!(this.checkIn && this.checkOut);
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
