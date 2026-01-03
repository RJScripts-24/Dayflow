-- 1. Create Database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dayflow_db;
USE dayflow_db;

-- 2. Users Table (Employees & Admins)
-- ID is VARCHAR to support custom format "EMP20260001"
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(20) PRIMARY KEY, 
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'hr', 'employee') DEFAULT 'employee',
    
    -- Professional Details
    department VARCHAR(50),
    designation VARCHAR(50),
    joinDate DATE DEFAULT (CURRENT_DATE),
    
    -- Financial Details (Gross Wage used for Salary Engine)
    wage DECIMAL(10, 2) DEFAULT 0.00,
    bankAccountNumber VARCHAR(30),
    
    -- System Flags
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    
    check_in_time DATETIME,
    check_out_time DATETIME,
    
    -- Status derived from work hours
    status ENUM('Present', 'Absent', 'Half Day', 'On Duty', 'Paid Leave', 'Holiday') DEFAULT 'Absent',
    work_hours FLOAT DEFAULT 0.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relationships & Constraints
    FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employeeId, date) -- One record per employee per day
);

-- 4. Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(20) NOT NULL,
    
    leaveType ENUM('Sick Leave', 'Casual Leave', 'Earned Leave', 'Unpaid Leave') NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    reason TEXT NOT NULL,
    
    -- Approval Workflow
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    adminResponse TEXT,
    reviewedBy VARCHAR(20), -- Admin ID who reviewed it
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Payroll Table (Stores Historical Salary Slips)
CREATE TABLE IF NOT EXISTS payrolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(20) NOT NULL,
    
    -- Period
    month INT NOT NULL,
    year INT NOT NULL,
    
    -- Calculation Inputs
    totalDays INT NOT NULL,   -- e.g., 30 or 31
    payableDays FLOAT NOT NULL, -- Actual days worked
    
    -- Financial Breakdown (Snapshot at time of generation)
    basic DECIMAL(10, 2) NOT NULL,
    hra DECIMAL(10, 2) NOT NULL,
    allowances DECIMAL(10, 2) NOT NULL, -- Fixed + Special + Bonus + LTA combined
    
    -- Deductions
    deductions DECIMAL(10, 2) NOT NULL, -- PF + PT
    
    -- Final Output
    netSalary DECIMAL(10, 2) NOT NULL,
    
    status ENUM('Processed', 'Paid') DEFAULT 'Processed',
    paymentDate DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_payroll (employeeId, month, year) -- One slip per month
);