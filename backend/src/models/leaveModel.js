const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Assuming the new MySQL config
const Employee = require('./Employee');

const Leave = sequelize.define('Leave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id'
        }
    },
    leaveType: {
        type: DataTypes.ENUM('Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Unpaid Leave'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please specify the type of leave' }
        }
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a start date' }
        }
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide an end date' }
        }
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a reason for the leave' }
        }
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    adminResponse: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reviewedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'leaves',
    hooks: {
        beforeValidate: (leave) => {
            if (leave.startDate && leave.endDate) {
                if (new Date(leave.startDate) > new Date(leave.endDate)) {
                    throw new Error('End date cannot be before start date');
                }
            }
        }
    }
});

// Define Association
// Note: Usually associations are grouped in an index.js file, but can be defined here if this is the entry point.
Employee.hasMany(Leave, { foreignKey: 'employeeId' });
Leave.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = Leave;