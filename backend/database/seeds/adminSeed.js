const mysql = require('mysql2/promise');
const { hashPassword } = require('../../src/utils/passwordHelper');
require('dotenv').config(); // Ensure we can read DB credentials

const seedAdmin = async () => {
    let connection;
    try {
        // Create a connection specifically for this seed script
        // (We create a new connection here to ensure the script can run standalone)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Connected to database for seeding...');

        // 1. Admin Credentials (Change these for production)
        const adminEmail = 'admin@dayflow.com';
        const adminPassword = 'AdminPassword123!';
        const adminName = 'Master Admin';

        // 2. Check if admin exists
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [adminEmail]
        );

        if (rows.length > 0) {
            console.log('⚠️  Admin account already exists. Skipping seed.');
            process.exit(0);
        }

        // 3. Hash the password
        const hashedPassword = await hashPassword(adminPassword);

        // 4. Insert Admin
        // Assuming table columns: id, firstName, lastName, email, password, role, ...
        const sql = `
            INSERT INTO users 
            (firstName, lastName, email, password, role, department, designation, wage, joinDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            'Master',
            'Admin',
            adminEmail,
            hashedPassword,
            'admin',        // Role
            'IT',           // Department
            'System Owner', // Designation
            0,              // Wage (Admin might not have payroll processed this way)
            new Date()      // Join Date
        ];

        await connection.execute(sql, values);

        console.log('✅ Master Admin created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
};

seedAdmin();