const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const logger = require('../config/logger');

// Load Environment Variables
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

// Initialize App
const app = express();

// --- GLOBAL MIDDLEWARE ---

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(cors());

// 3. Body Parsers (JSON data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. HTTP Request Logging (Connects to our Winston logger)
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// --- STATIC FILES ---
// Serves images and generated PDFs from the 'public' folder
app.use('/public', express.static(path.join(__dirname, '../public')));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emp', employeeRoutes);
app.use('/api/payroll', payrollRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send({ message: 'Dayflow API is running...' });
});

// --- ERROR HANDLING ---

// 404 Not Found Middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log the error using our custom logger
    logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;