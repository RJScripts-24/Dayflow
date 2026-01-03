const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Employee = require('./Employee');

const Salary = sequelize.define('Salary', {
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
        },
        onDelete: 'CASCADE'
    },
    payPeriod: {
        type: DataTypes.STRING, // Format: 'YYYY-MM' or 'January 2026'
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Pay period is required' }
        }
    },
    basicSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    allowances: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
            min: 0
        }
    },
    deductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        validate: {
            min: 0
        }
    },
    netSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processed', 'Paid'),
        defaultValue: 'Processed'
    }
}, {
    tableName: 'salaries',
    timestamps: true
});

// Define Association
Employee.hasMany(Salary, { foreignKey: 'employeeId' });
Salary.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = Salary;