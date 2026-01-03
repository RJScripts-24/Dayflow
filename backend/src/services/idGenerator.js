/**
 * Generates the next sequential ID based on the previous ID.
 * Format: PREFIX + YEAR + SEQUENCE (e.g., EMP20260042)
 * * @param {string} lastId - The last ID fetched from the database (can be null).
 * @param {string} prefix - The prefix for the ID (default: 'EMP').
 * @returns {string} The new unique ID.
 */
const generateNextId = (lastId, prefix = 'EMP') => {
    const currentYear = new Date().getFullYear().toString();
    const sequenceLength = 4; // Length of the numeric part (e.g., 0001)

    // Default start if no user exists yet
    if (!lastId) {
        return `${prefix}${currentYear}${'1'.padStart(sequenceLength, '0')}`;
    }

    // Extract Year and Sequence from the last ID
    // Assumes format: [PREFIX] + [YYYY] + [XXXX]
    // Example: EMP20250045 -> Year: 2025, Seq: 0045
    
    // Check if the last ID includes the current year
    const idYear = lastId.substring(prefix.length, prefix.length + 4);
    const idSequence = parseInt(lastId.slice(-sequenceLength));

    let nextSequence;

    if (idYear === currentYear) {
        // Same year: Increment sequence
        nextSequence = idSequence + 1;
    } else {
        // New year: Reset sequence
        nextSequence = 1;
    }

    // Format sequence with leading zeros
    const nextSequenceStr = nextSequence.toString().padStart(sequenceLength, '0');

    return `${prefix}${currentYear}${nextSequenceStr}`;
};

module.exports = {
    generateNextId
};