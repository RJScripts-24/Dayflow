/**
 * API Types - Generated from OpenAPI specification
 * Base URL: http://localhost:5000
 */

// ============================================================================
// Common Types
// ============================================================================

export type UserRole = 'admin' | 'hr' | 'employee';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type PaymentStatus = 'Pending' | 'Processed' | 'Paid';

// ============================================================================
// Auth Types
// ============================================================================

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  wage?: number;
  joinDate?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// ============================================================================
// Employee Types
// ============================================================================

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  wage?: number;
  joinDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  wage: number;
  joinDate: string;
}

export interface CreateEmployeeResponse {
  message: string;
  employee: Employee;
  temporaryPassword: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  designation?: string;
  wage?: number;
  joinDate?: string;
}

export interface UpdateEmployeeResponse {
  message: string;
}

export interface DeleteEmployeeResponse {
  message: string;
}

// ============================================================================
// Attendance Types
// ============================================================================

export interface Attendance {
  id: number;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  hoursWorked?: number;
}

export interface MarkAttendanceResponse {
  message: string;
  attendance?: Attendance;
}

export interface AttendanceHistoryQuery {
  month?: number;
  year?: number;
}

// ============================================================================
// Leave Types
// ============================================================================

export interface Leave {
  id: number;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  adminResponse?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApplyLeaveResponse {
  message: string;
  leaveId: number;
}

export interface UpdateLeaveRequest {
  status: LeaveStatus;
  adminResponse?: string;
}

export interface UpdateLeaveResponse {
  message: string;
  data: Leave;
}

// ============================================================================
// Payroll Types
// ============================================================================

export interface Payroll {
  id: number;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  deductions?: number;
  bonuses?: number;
  netSalary: number;
  status: PaymentStatus;
  paymentDate?: string;
  createdAt?: string;
}

export interface PayrollQuery {
  month?: number;
  year?: number;
}

export interface ProcessPayrollRequest {
  month: number;
  year: number;
}

export interface ProcessPayrollResponse {
  message: string;
  results: Payroll[];
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
  paymentDate?: string;
}

export interface UpdatePaymentStatusResponse {
  message: string;
  status: PaymentStatus;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface SystemStats {
  totalUsers: number;
  totalLeaves: number;
  pendingLeaves: number;
  totalEmployees?: number;
  presentToday?: number;
  onLeaveToday?: number;
}

export interface DeleteUserResponse {
  message: string;
}

export interface Room {
  id: number;
  name?: string;
  capacity?: number;
  status?: string;
}

export interface RoomsResponse {
  message: string;
  rooms: Room[];
}

export interface DeleteRoomResponse {
  message: string;
}

// ============================================================================
// API Error Response
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}
