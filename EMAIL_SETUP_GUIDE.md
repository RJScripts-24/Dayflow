# Email Notification Setup Guide

## Feature Status: ✅ Already Implemented

Your project already has the email notification feature fully implemented! When an admin creates an employee, the system automatically:

1. **Generates** a random 8-character password (alphanumeric + special chars)
2. **Sends** an email to the employee with their Employee ID and temporary password
3. **Hashes** the password before storing it in the database

## Gmail SMTP Configuration

### Step 1: Enable App-Specific Password

Since you're using Gmail, you need to generate an **App Password** (not your regular Gmail password):

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already)
3. Go to **App passwords** (at the bottom of 2-Step Verification page)
4. Select **Mail** and **Other (Custom name)** → Enter "Dayflow"
5. Click **Generate**
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 2: Update .env File

Open `backend/.env` and update these values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # The 16-char app password from Step 1
FROM_NAME=Dayflow HR Team
FROM_EMAIL=your-actual-email@gmail.com
```

### Step 3: Test the Feature

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Login as admin and create a new employee through the CreateEmployeeModal

3. Check the employee's email inbox - they should receive:
   ```
   Subject: Welcome to Dayflow - Your Login Credentials
   
   Hello [FirstName],
   
   Welcome to the team! Your account has been created.
   
   Here are your login details:
   Employee ID: EMP20260001
   Temporary Password: Xy7@aB2k
   
   Please login and change your password immediately.
   
   Regards,
   HR Team
   ```

## Code Implementation

The email sending is handled in these files:

- **Controller**: `backend/src/controllers/adminController.js` (lines 50-68)
- **Email Service**: `backend/src/utils/emailSender.js`
- **Password Generator**: `backend/src/utils/passwordHelper.js`

### Email Template (Current)

The current implementation sends a plain text email. If you want to customize it with HTML:

```javascript
await sendEmail({
    email: newUser.email,
    subject: emailSubject,
    message: emailMessage,
    html: `
        <div style="font-family: Arial, sans-serif;">
            <h2>Welcome to Dayflow!</h2>
            <p>Hello ${firstName},</p>
            <p>Your account has been created. Here are your login credentials:</p>
            <table>
                <tr><td><strong>Employee ID:</strong></td><td>${employeeId}</td></tr>
                <tr><td><strong>Temporary Password:</strong></td><td>${tempPassword}</td></tr>
            </table>
            <p>Please login and change your password immediately.</p>
        </div>
    `
});
```

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Step Verification is enabled

2. **"Connection timeout"**
   - Check if port 587 is blocked by your firewall
   - Try using port 465 with `secure: true` in transporter config

3. **Email not received**
   - Check spam/junk folder
   - Verify the recipient email is correct
   - Check backend logs for errors

### Enable Detailed Logging

Add this to `emailSender.js` for debugging:

```javascript
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true, // Add this
    logger: true // Add this
});
```

## Security Notes

- ✅ Passwords are hashed before database storage
- ✅ Plain password is only sent via email (one-time)
- ✅ Employee can change password after first login
- ⚠️ Never commit `.env` file to version control (add to `.gitignore`)

## Next Steps

After setting up:
1. Test employee creation
2. Verify email delivery
3. Test employee login with received credentials
4. Optionally: Implement "Change Password on First Login" feature
