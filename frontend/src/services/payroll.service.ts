/**
 * Payroll Service
 * Handles all payroll-related API calls
 */

import apiClient from './api.client';
import type {
  Payroll,
  PayrollQuery,
  ProcessPayrollRequest,
  ProcessPayrollResponse,
  UpdatePaymentStatusRequest,
  UpdatePaymentStatusResponse,
} from '../types/api.types';

export class PayrollService {
  /**
   * Get all payrolls with optional filters
   */
  static async getAllPayrolls(query?: PayrollQuery): Promise<Payroll[]> {
    const response = await apiClient.get<Payroll[]>('/payroll', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get payroll by employee ID
   */
  static async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    const response = await apiClient.get<Payroll[]>(`/payroll/employee/${employeeId}`);
    return response.data;
  }

  /**
   * Process payroll for a month
   */
  static async processPayroll(data: ProcessPayrollRequest): Promise<ProcessPayrollResponse> {
    const response = await apiClient.post<ProcessPayrollResponse>('/payroll', data);
    return response.data;
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    id: number,
    data: UpdatePaymentStatusRequest
  ): Promise<UpdatePaymentStatusResponse> {
    const response = await apiClient.put<UpdatePaymentStatusResponse>(`/payroll/${id}/status`, data);
    return response.data;
  }
}

export default PayrollService;
