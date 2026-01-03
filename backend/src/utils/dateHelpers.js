/**
 * Formats a JS Date object to MySQL DATE string (YYYY-MM-DD).
 * @param {Date|string} date
 * @returns {string} 'YYYY-MM-DD'
 */
const formatToSQLDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Formats a JS Date object to MySQL DATETIME string (YYYY-MM-DD HH:mm:ss).
 * @param {Date|string} date
 * @returns {string} 'YYYY-MM-DD HH:mm:ss'
 */
const formatToSQLDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Returns the start and end dates of a month for a given year.
 * Useful for querying attendance/payroll for a specific month.
 * @param {number} year 
 * @param {number} month (1-12)
 * @returns {Object} { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
 */
const getMonthRange = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    // Setting day to 0 of the next month gives the last day of the current month
    const endDate = new Date(year, month, 0); 

    return {
        start: formatToSQLDate(startDate),
        end: formatToSQLDate(endDate)
    };
};

/**
 * Checks if a date falls on a weekend (Saturday or Sunday).
 * @param {Date|string} date 
 * @returns {boolean}
 */
const isWeekend = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

module.exports = {
    formatToSQLDate,
    formatToSQLDateTime,
    getMonthRange,
    isWeekend
};