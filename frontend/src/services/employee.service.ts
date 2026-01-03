/**
 * Employee Service
 * Handles all employee-related API calls
 */

import apiClient from './api.client';
import type {
  Employee,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  Attendance,
  MarkAttendanceResponse,
  AttendanceHistoryQuery,
  ApplyLeaveRequest,
  ApplyLeaveResponse,
} from '../types/api.types';

export class EmployeeService {
  /**
   * Get all employees
   */
  static async getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>('/emp');
    return response.data;
  }

  /**
   * Get employee by ID
   */
  static async getEmployeeById(id: string): Promise<Employee> {
    const response = await apiClient.get<Employee>(`/emp/${id}`);
    return response.data;
  }

  /**
   * Create new employee
   */
  static async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const response = await apiClient.post<CreateEmployeeResponse>('/emp', data);
    return response.data;
  }

  /**
   * Update employee
   */
  static async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse> {
    const response = await apiClient.put<UpdateEmployeeResponse>(`/emp/${id}`, data);
    return response.data;
  }

  /**
   * Delete employee
   */
  static async deleteEmployee(id: string): Promise<DeleteEmployeeResponse> {
    const response = await apiClient.delete<DeleteEmployeeResponse>(`/emp/${id}`);
    return response.data;
  }

  /**
   * Get current employee profile
   */
  static async getProfile(): Promise<Employee> {
    const response = await apiClient.get<Employee>('/emp/profile');
    return response.data;
  }

  /**
   * Mark attendance (check-in/check-out)
   */
  static async markAttendance(): Promise<MarkAttendanceResponse> {
    const response = await apiClient.post<MarkAttendanceResponse>('/emp/attendance');
    return response.data;
  }

  /**
   * Get attendance history
   */
  static async getAttendanceHistory(query?: AttendanceHistoryQuery): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>('/emp/attendance/history', {
      params: query,
    });
    return response.data;
  }

  /**
   * Apply for leave
   */
  static async applyLeave(data: ApplyLeaveRequest): Promise<ApplyLeaveResponse> {
    const response = await apiClient.post<ApplyLeaveResponse>('/emp/leave', data);
    return response.data;
  }

  /**
   * Get employee's own leave requests
   */
  static async getMyLeaves(): Promise<Leave[]> {
    const response = await apiClient.get<Leave[]>('/emp/leaves');
    return response.data;
  }
}

export default EmployeeService;
