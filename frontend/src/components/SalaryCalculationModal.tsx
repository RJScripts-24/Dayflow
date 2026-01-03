/**
 * SalaryCalculationModal - Modal to calculate and display salary for an employee
 */

import { useState, useEffect } from 'react';
import { X, Download, Calendar, User, DollarSign, Clock } from 'lucide-react';
import { PayrollService } from '../services';

interface SalaryCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
}

interface SalaryCalculation {
  employee: {
    id: string;
    name: string;
    department: string;
    designation: string;
    wage: number;
  };
  period: {
    month: number;
    year: number;
    totalDays: number;
    payableDays: number;
  };
  earnings: {
    basic: number;
    hra: number;
    fixedAllowance: number;
    lta: number;
    performanceBonus: number;
    standardAllowance: number;
    gross: number;
  };
  deductions: {
    pf: number;
    pt: number;
    total: number;
  };
  netSalary: number;
  attendanceRecords: number;
  calculation?: {
    formula: string;
    dailyRate: number;
  };
}

export function SalaryCalculationModal({ isOpen, onClose, employeeId, employeeName }: SalaryCalculationModalProps) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryCalculation | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen && employeeId) {
      calculateSalary();
    }
  }, [isOpen, employeeId, selectedMonth, selectedYear]);

  const calculateSalary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PayrollService.calculateSalary(employeeId, selectedMonth, selectedYear);
      setSalaryData(data);
    } catch (err: any) {
      console.error('Error calculating salary:', err);
      setError(err.response?.data?.message || 'Failed to calculate salary');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSlip = async () => {
    try {
      setDownloading(true);
      setError(null);
      await PayrollService.generateSalarySlip(employeeId, selectedMonth, selectedYear);
    } catch (err: any) {
      console.error('Error downloading salary slip:', err);
      setError(err.response?.data?.message || 'Failed to download salary slip');
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl my-8"
        style={{ 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div className="bg-white border-b border-[#E2E0EA] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#1F1B2E] mb-1" style={{ fontSize: '24px', fontWeight: 600 }}>
                Salary Calculation
              </h2>
              <p className="text-[#6E6A7C]" style={{ fontSize: '16px' }}>
                {employeeName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F6FB] rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-[#6E6A7C]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Period Selection */}
          <div className="bg-[#F7F6FB] rounded-xl p-4 border border-[#E2E0EA]">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#2AB7CA]" />
              <h3 className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                Select Period
              </h3>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[#6E6A7C] mb-2" style={{ fontSize: '14px' }}>
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-[#E2E0EA] rounded-lg focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20"
                  style={{ fontSize: '16px' }}
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[#6E6A7C] mb-2" style={{ fontSize: '14px' }}>
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-[#E2E0EA] rounded-lg focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20"
                  style={{ fontSize: '16px' }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600" style={{ fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AB7CA] mx-auto mb-4"></div>
                <p className="text-[#6E6A7C]" style={{ fontSize: '16px' }}>Calculating salary...</p>
              </div>
            </div>
          ) : salaryData ? (
            <>
              {/* Employee & Period Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F7F6FB] rounded-lg p-4 border border-[#E2E0EA]">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#2AB7CA]" />
                    <span className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>Department</span>
                  </div>
                  <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {salaryData.employee.department || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#F7F6FB] rounded-lg p-4 border border-[#E2E0EA]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#2AB7CA]" />
                    <span className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>Days Worked</span>
                  </div>
                  <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {salaryData.period.payableDays} / {salaryData.period.totalDays} days
                  </p>
                </div>
              </div>

              {/* Calculation Info */}
              {salaryData.calculation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800" style={{ fontSize: '14px', fontWeight: 500 }}>
                    💡 Calculation: {salaryData.calculation.formula}
                  </p>
                  <p className="text-blue-600 mt-1" style={{ fontSize: '13px' }}>
                    Daily Rate: ₹{salaryData.calculation.dailyRate} × {salaryData.period.payableDays} days worked
                  </p>
                </div>
              )}

              {/* Earnings */}
              <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
                  Earnings
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Basic Salary', value: salaryData.earnings.basic },
                    { label: 'HRA', value: salaryData.earnings.hra },
                    { label: 'Fixed Allowance', value: salaryData.earnings.fixedAllowance },
                    { label: 'LTA', value: salaryData.earnings.lta },
                    { label: 'Performance Bonus', value: salaryData.earnings.performanceBonus },
                    { label: 'Standard Allowance', value: salaryData.earnings.standardAllowance },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-[#6E6A7C]" style={{ fontSize: '15px' }}>{item.label}</span>
                      <span className="text-[#1F1B2E]" style={{ fontSize: '15px', fontWeight: 500 }}>
                        ₹{item.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-[#E2E0EA] pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Gross Earnings
                      </span>
                      <span className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        ₹{salaryData.earnings.gross.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
                  Deductions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '15px' }}>Provident Fund (PF)</span>
                    <span className="text-[#D64545]" style={{ fontSize: '15px', fontWeight: 500 }}>
                      -₹{salaryData.deductions.pf.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '15px' }}>Professional Tax (PT)</span>
                    <span className="text-[#D64545]" style={{ fontSize: '15px', fontWeight: 500 }}>
                      -₹{salaryData.deductions.pt.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-[#E2E0EA] pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Total Deductions
                      </span>
                      <span className="text-[#D64545]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        -₹{salaryData.deductions.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-[#2AB7CA] to-[#239BAA] rounded-xl p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8" />
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9 }}>Net Salary</p>
                      <p style={{ fontSize: '32px', fontWeight: 700 }}>
                        ₹{salaryData.netSalary.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#E2E0EA] p-6 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#E2E0EA] rounded-lg text-[#1F1B2E] hover:bg-[#F7F6FB] transition-colors"
              style={{ fontSize: '16px', fontWeight: 500 }}
            >
              Close
            </button>
            <button
              onClick={handleDownloadSlip}
              disabled={loading || !salaryData || downloading}
              className="flex-1 px-6 py-3 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize: '16px', fontWeight: 500 }}
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Downloading...' : 'Download Salary Slip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
