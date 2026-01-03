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

  /**
   * Download salary slip PDF
   */
  static async downloadSalarySlip(payrollId: number): Promise<Blob> {
    const response = await apiClient.get(`/payroll/download/${payrollId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Calculate salary on-demand for an employee
   */
  static async calculateSalary(employeeId: string, month: number, year: number): Promise<any> {
    const response = await apiClient.post('/payroll/calculate', {
      employeeId,
      month,
      year,
    });
    return response.data;
  }

  /**
   * Generate and download salary slip on-demand
   */
  static async generateSalarySlip(employeeId: string, month: number, year: number): Promise<void> {
    const response = await apiClient.post(
      '/payroll/generate-slip',
      {
        employeeId,
        month,
        year,
      },
      {
        responseType: 'blob',
      }
    );

    // Create a download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SalarySlip_${employeeId}_${month}_${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default PayrollService;