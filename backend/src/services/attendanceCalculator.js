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
    let totalPayableDays = 0;

    attendanceRecords.forEach(record => {
        // Calculate based on actual work hours (8 hours = 1 day)
        if (record.work_hours && record.work_hours > 0) {
            // Convert work hours to days (8 hours = 1 full day)
            const daysWorked = record.work_hours / 8;
            totalPayableDays += Math.min(daysWorked, 1); // Cap at 1 day max per record
        } else {
            // Fallback to status-based calculation if work hours not available
            const status = record.status;
            
            if (status === 'Present' || status === 'On Duty' || status === 'Official Trip') {
                totalPayableDays += 1;
            } else if (status === 'Half Day') {
                totalPayableDays += 0.5;
            } else if (status === 'Paid Leave') {
                totalPayableDays += 1; 
            }
        }
    });

    return parseFloat(totalPayableDays.toFixed(2));
};

module.exports = {
    calculateWorkHours,
    determineAttendanceStatus,
    calculatePayableDays
};