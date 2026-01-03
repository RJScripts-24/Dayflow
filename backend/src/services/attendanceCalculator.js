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
        const status = record.status;
        
        if (status === 'Present' || status === 'On Duty' || status === 'Official Trip') {
            totalPayableDays += 1;
        } else if (status === 'Half Day') {
            totalPayableDays += 0.5;
        } else if (status === 'Paid Leave') {
            totalPayableDays += 1; 
        }
    });

    return totalPayableDays;
};

module.exports = {
    calculateWorkHours,
    determineAttendanceStatus,
    calculatePayableDays
};