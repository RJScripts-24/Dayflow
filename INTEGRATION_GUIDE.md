# Dayflow - Frontend & Backend Integration Guide

## 🔗 Integration Status

The frontend and backend have been successfully integrated with the following configurations:

### Backend Configuration
- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/api`
- **CORS**: Configured to accept requests from `http://localhost:3000`
- **Authentication**: JWT-based with Bearer token

### Frontend Configuration
- **Base URL**: `http://localhost:3000`
- **API Base URL**: `http://localhost:5000`
- **Proxy**: Configured in Vite to forward `/api/*` requests to backend
- **Token Storage**: localStorage

## 📋 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dayflow_db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. Initialize database:
```bash
# Run the init.sql script in your MySQL server
mysql -u root -p < database/init.sql
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔌 API Endpoints Integration

### Authentication (`/api/auth`)
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login
- ✅ `GET /api/auth/me` - Get current user
- ✅ `PUT /api/auth/change-password` - Change password

### Employee (`/api/emp`)
- ✅ `GET /api/emp/profile` - Get employee profile
- ✅ `POST /api/emp/attendance` - Mark attendance
- ✅ `GET /api/emp/attendance/history` - Get attendance history
- ✅ `POST /api/emp/leave` - Apply for leave
- ✅ `GET /api/emp` - Get all employees (Admin/HR)
- ✅ `POST /api/emp` - Create employee (Admin/HR)
- ✅ `GET /api/emp/:id` - Get employee by ID (Admin/HR)
- ✅ `PUT /api/emp/:id` - Update employee (Admin/HR)
- ✅ `DELETE /api/emp/:id` - Delete employee (Admin)

### Admin (`/api/admin`)
- ✅ `GET /api/admin/stats` - Get system statistics
- ✅ `GET /api/admin/users` - Get all users
- ✅ `DELETE /api/admin/users/:id` - Delete user
- ✅ `PUT /api/admin/leave/:leaveId` - Approve/Reject leave

### Payroll (`/api/payroll`)
- ✅ `GET /api/payroll` - Get all payrolls
- ✅ `POST /api/payroll` - Process payroll
- ✅ `GET /api/payroll/employee/:employeeId` - Get payroll by employee
- ✅ `PUT /api/payroll/:id/status` - Update payment status

## 🛡️ Security Features

1. **CORS Protection**: Only accepts requests from configured frontend URL
2. **JWT Authentication**: All protected routes require valid JWT token
3. **Role-Based Access Control**: Admin, HR, and Employee roles with specific permissions
4. **Password Hashing**: bcrypt for password security
5. **Request Validation**: Input validation on all endpoints

## 📦 Key Integration Points

### 1. API Client Setup
The frontend uses Axios with interceptors for:
- Automatically attaching JWT tokens to requests
- Handling 401 unauthorized responses
- Centralized error handling

### 2. CORS Configuration
Backend is configured to accept requests from the frontend with credentials support.

### 3. Proxy Configuration
Vite dev server proxies `/api` requests to backend to avoid CORS issues during development.

### 4. Token Management
- Tokens stored in localStorage
- Automatically included in Authorization header
- Auto-logout on token expiration

## 🧪 Testing the Integration

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Try the following flows:
   - Register a new user
   - Login with credentials
   - Access employee dashboard
   - Mark attendance
   - Apply for leave
   - Admin can view all users and manage leaves

## 📊 Database Schema

The application uses the following main tables:
- `users` - User accounts
- `attendance` - Daily attendance records
- `leaves` - Leave applications
- `payroll` - Monthly payroll records
- `salary_structure` - Salary components

## 🔧 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure backend `.env` has `FRONTEND_URL=http://localhost:3000`

### Issue: 401 Unauthorized
**Solution**: Check if JWT token is valid and not expired

### Issue: Connection Refused
**Solution**: Ensure both backend (port 5000) and frontend (port 3000) are running

### Issue: Database Connection Error
**Solution**: Verify MySQL credentials in backend `.env` file

## 📝 Notes

- Default backend port: 5000
- Default frontend port: 3000
- JWT token expires in 24 hours
- All passwords are hashed using bcrypt
- File uploads stored in `backend/public/uploads`

## 🚀 Production Deployment

For production deployment:
1. Update `VITE_API_BASE_URL` to production backend URL
2. Update `FRONTEND_URL` in backend .env to production frontend URL
3. Set `NODE_ENV=production`
4. Build frontend: `npm run build`
5. Serve frontend build from a static server or CDN
6. Use process manager (PM2) for backend
7. Configure SSL/TLS certificates
8. Set up database backups

---

**Integration completed successfully!** 🎉
