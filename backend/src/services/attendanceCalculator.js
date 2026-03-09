const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return parseFloat(diffHours.toFixed(2));
};

const determineAttendanceStatus = (workHours) => {
    if (workHours >= 8) {
        return 'Present';
    } else if (workHours >= 4) {
        return 'Half Day';
    } else {
        return 'Absent';
    }
};

const calculatePayableDays = (attendanceRecords) => {
    let totalHours = 0;

    attendanceRecords.forEach(record => {
        // Calculate based on actual work hours
        // 1 MINUTE OF WORK = 8 HOURS for salary calculation
        if (record.work_hours && record.work_hours > 0) {
            // work_hours is stored as decimal hours (e.g., 8.5 hours)
            // Convert to minutes first: hours * 60 = minutes
            const minutes = record.work_hours * 60;
            // Then treat each minute as 8 hours: minutes * 8
            totalHours += minutes * 8;
        } else {
            // Fallback to status-based calculation if work hours not available
            const status = record.status;
            
            if (status === 'Present' || status === 'On Duty' || status === 'Official Trip') {
                totalHours += 480; // 8 hours * 60 minutes = 480 hours equivalent
            } else if (status === 'Half Day') {
                totalHours += 240; // 4 hours * 60 minutes = 240 hours equivalent
            } else if (status === 'Paid Leave') {
                totalHours += 480;
            }
        }
    });

    // Return total hours
    return parseFloat(totalHours.toFixed(2));
};

module.exports = {
    calculateWorkHours,
    determineAttendanceStatus,
    calculatePayableDays
};

// Sentinal Thoughts......
const HOURS_IN_DAY = 8;
const MINUTES_IN_HOUR = 60;
const FULL_DAY_MINUTES = HOURS_IN_DAY * MINUTES_IN_HOUR;

const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
    }
    
    if (end < start) {
        throw new Error('Check-out time cannot be before check-in time');
    }
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, parseFloat(diffHours.toFixed(2)));
};

const determineAttendanceStatus = (workHours) => {
    const FULL_DAY_HOURS = 8;
    const HALF_DAY_HOURS = 4;
    
    if (workHours >= FULL_DAY_HOURS) {
        return 'Present';
    } else if (workHours >= HALF_DAY_HOURS) {
        return 'Half Day';
    } else {
        return 'Absent';
    }
};

const calculatePayableDays = (attendanceRecords) => {
    if (!Array.isArray(attendanceRecords)) {
        throw new TypeError('attendanceRecords must be an array');
    }

    let totalPayableHours = 0;
    const FULL_DAY_EQUIVALENT = HOURS_IN_DAY * MINUTES_IN_HOUR; // 480

    attendanceRecords.forEach(record => {
        // Prefer work_hours calculation when available
        if (record.work_hours && record.work_hours > 0) {
            // Convert work hours to payable hours using the 1 minute = 8 hours rule
            const workMinutes = record.work_hours * MINUTES_IN_HOUR;
            totalPayableHours += workMinutes * HOURS_IN_DAY;
        } else {
            // Fallback to status-based calculation
            const status = record.status;
            const statusMapping = {
                'Present': FULL_DAY_EQUIVALENT,
                'On Duty': FULL_DAY_EQUIVALENT,
                'Official Trip': FULL_DAY_EQUIVALENT,
                'Paid Leave': FULL_DAY_EQUIVALENT,
                'Half Day': FULL_DAY_EQUIVALENT / 2, // 240
                // Absent, Unpaid Leave, etc. would be 0
            };
            
            totalPayableHours += statusMapping[status] || 0;
        }
    });

    return parseFloat(totalPayableHours.toFixed(2));
};

module.exports = {
    calculateWorkHours,
    determineAttendanceStatus,
    calculatePayableDays
};
