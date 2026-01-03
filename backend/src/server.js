const app = require('./app');
const logger = require('../config/logger');
const db = require('../config/db.config'); // Import to trigger DB connection check

// Load env vars (if not already loaded in app.js)
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Start the Server
const server = app.listen(PORT, async () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Optional: Log Database Status
    try {
        await db.query('SELECT 1');
        logger.info('✅ Database connection verified');
    } catch (error) {
        logger.error(`❌ Database connection failed: ${error.message}`);
        // We might want to exit if DB is dead, or keep retrying
        // process.exit(1); 
    }
});

// --- HANDLE UNHANDLED REJECTIONS ---
// (e.g., if the Database password is wrong, this catches the crash)
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// --- HANDLE UNCAUGHT EXCEPTIONS ---
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});