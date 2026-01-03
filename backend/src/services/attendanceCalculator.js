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