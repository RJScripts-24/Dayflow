const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    // ideally, service settings are stored in .env
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        debug: true, // Show debug output
        logger: true // Log information
    });

    // 2. Define email options
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Plain text body
        html: options.html,    // HTML body (optional)
        attachments: options.attachments // Array of attachments (optional)
    };

    // 3. Send the email
    const info = await transporter.sendMail(message);

    console.log(`Email sent: ${info.messageId}`);
};

module.exports = sendEmail;