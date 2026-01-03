const bcrypt = require('bcryptjs');

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} enteredPassword - The password entered by the user.
 * @param {string} storedHash - The hashed password stored in the database.
 * @returns {Promise<boolean>} - True if they match, false otherwise.
 */
const matchPassword = async (enteredPassword, storedHash) => {
    return await bcrypt.compare(enteredPassword, storedHash);
};

/**
 * Generates a random temporary password.
 * Useful for admin-created accounts or password resets.
 * Length: 8 characters (alphanumeric).
 * @returns {string} - The temporary password.
 */
const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

module.exports = {
    hashPassword,
    matchPassword,
    generateTempPassword
};