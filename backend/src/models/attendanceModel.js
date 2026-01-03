const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half Day', 'Leave', 'On Duty'],
        default: 'Present',
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    workHours: {
        type: Number,
        default: 0
    },
    overtime: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);