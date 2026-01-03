const mysql = require('mysql2/promise');
const { hashPassword } = require('../../src/utils/passwordHelper');
require('dotenv').config();

const seedAdmin = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Connected to database for seeding...');

        const adminEmail = 'admin@dayflow.com';
        const adminPassword = 'AdminPassword123!';

        // Check if admin exists
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [adminEmail]
        );

        if (rows.length > 0) {
            console.log('⚠️  Admin account already exists. Skipping seed.');
            process.exit(0);
        }

        const hashedPassword = await hashPassword(adminPassword);

        // --- FIX: ADDED 'id' TO QUERY AND VALUES ---
        const sql = `
            INSERT INTO users 
            (id, firstName, lastName, email, password, role, department, designation, wage, joinDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            'ADMIN001',      // <--- Manually assigned ID
            'Master',
            'Admin',
            adminEmail,
            hashedPassword,
            'admin',
            'IT',
            'System Owner',
            0,
            new Date()
        ];

        await connection.execute(sql, values);

        console.log('✅ Master Admin created successfully!');
        console.log(`🆔 Admin ID: ADMIN001`);
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