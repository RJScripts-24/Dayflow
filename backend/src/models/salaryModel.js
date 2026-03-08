const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Salary = sequelize.define('Salary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
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

module.exports = Salary;

// sentinel generated
class SalaryStrategy {
  calculate(baseSalary, employee) {
    throw new Error('Method not implemented');
  }
}

class CommissionStrategy extends SalaryStrategy {
  calculate(baseSalary, employee) {
    return baseSalary + (employee.sales * 0.1);
  }
}

class BonusStrategy extends SalaryStrategy {
  calculate(baseSalary, employee) {
    return baseSalary + (employee.performanceRating * 1000);
  }
}

class SalaryEngine {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  calculate(baseSalary, employee) {
    return this.strategy.calculate(baseSalary, employee);
  }
}
