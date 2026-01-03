const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dayflow_db',
    waitForConnections: true,
    connectionLimit: 10, // Max concurrent connections
    queueLimit: 0
});

// Convert pool to allow async/await (Promises)
const promisePool = pool.promise();

// Optional: Test the connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('❌ Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('❌ Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('❌ Database connection was refused.');
        }
    } else {
        console.log('✅ Connected to MySQL Database');
        connection.release();
    }
});

module.exports = promisePool;