/**
 * SalaryDetailPage - Full page view for salary calculation details
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar, User, DollarSign, Clock, Briefcase } from 'lucide-react';
import { PayrollService } from '../services';

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
    baseSalary: number;
    workHours: number;
  };
}

export function SalaryDetailPage() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryCalculation | null>(null);
  
  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get('employeeId') || '';
  const employeeName = urlParams.get('employeeName') || '';
  const [selectedMonth, setSelectedMonth] = useState(
    parseInt(urlParams.get('month') || String(new Date().getMonth() + 1))
  );
  const [selectedYear, setSelectedYear] = useState(
    parseInt(urlParams.get('year') || String(new Date().getFullYear()))
  );

  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (employeeId) {
      calculateSalary();
    }
  }, [employeeId, selectedMonth, selectedYear]);

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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[#F7F6FB] pb-8">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-[#E2E0EA] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[#F7F6FB] rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-[#6E6A7C]" />
              </button>
              <div>
                <h1 className="text-[#1F1B2E] mb-1" style={{ fontSize: '28px', fontWeight: 700 }}>
                  Salary Details
                </h1>
                <p className="text-[#6E6A7C]" style={{ fontSize: '16px' }}>
                  {employeeName || 'Employee'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadSlip}
              disabled={loading || !salaryData || downloading}
              className="px-6 py-3 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontSize: '16px', fontWeight: 500 }}
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Downloading...' : 'Download Slip'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Period Selection */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#E2E0EA]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#2AB7CA]" />
            <h3 className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 600 }}>
              Select Period
            </h3>
          </div>
          <div className="flex gap-4 max-w-md">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600" style={{ fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#E2E0EA]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2AB7CA] mx-auto mb-4"></div>
            <p className="text-[#6E6A7C]" style={{ fontSize: '18px' }}>Calculating salary...</p>
          </div>
        ) : salaryData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Summary Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Employee Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E0EA]">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-[#2AB7CA]" />
                  <h3 className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 600 }}>
                    Employee Info
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Department</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      {salaryData.employee.department || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Designation</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      {salaryData.employee.designation || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Base Salary</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      ₹{salaryData.calculation?.baseSalary.toLocaleString('en-IN') || salaryData.employee.wage.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E0EA]">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#2AB7CA]" />
                  <h3 className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 600 }}>
                    Attendance
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Total Days</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      {salaryData.period.totalDays} days
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Days Worked</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      {salaryData.period.payableDays.toFixed(2)} days
                    </p>
                  </div>
                  {salaryData.calculation?.workHours !== undefined && (
                    <div>
                      <p className="text-[#6E6A7C] text-sm mb-1">Total Work Hours</p>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                        {salaryData.calculation.workHours.toFixed(2)} hours
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[#6E6A7C] text-sm mb-1">Records</p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                      {salaryData.attendanceRecords} entries
                    </p>
                  </div>
                </div>
              </div>

              {/* Net Salary Card */}
              <div className="bg-gradient-to-br from-[#2AB7CA] to-[#239BAA] rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-8 h-8" />
                  <div>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Net Salary</p>
                    <p style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
                      ₹{salaryData.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '13px', opacity: 0.85 }} className="mt-4">
                  {monthNames[salaryData.period.month - 1]} {salaryData.period.year}
                </p>
              </div>
            </div>

            {/* Right Column - Detailed Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calculation Formula */}
              {salaryData.calculation && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="text-blue-900 mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
                    💡 Calculation Method
                  </h3>
                  <p className="text-blue-800" style={{ fontSize: '15px' }}>
                    {salaryData.calculation.formula}
                  </p>
                  <p className="text-blue-600 mt-2" style={{ fontSize: '14px' }}>
                    Daily Rate: ₹{salaryData.calculation.dailyRate.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Earnings Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E0EA]">
                <h3 className="text-[#1F1B2E] mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
                  💰 Earnings Breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Basic Salary', value: salaryData.earnings.basic, description: '50% of wage' },
                    { label: 'House Rent Allowance (HRA)', value: salaryData.earnings.hra, description: '50% of basic' },
                    { label: 'Fixed Allowance', value: salaryData.earnings.fixedAllowance, description: 'Balancing component' },
                    { label: 'Leave Travel Allowance (LTA)', value: salaryData.earnings.lta, description: '8.33% of basic' },
                    { label: 'Performance Bonus', value: salaryData.earnings.performanceBonus, description: '8.33% of basic' },
                    { label: 'Standard Allowance', value: salaryData.earnings.standardAllowance, description: 'Fixed ₹4167' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-[#E2E0EA] last:border-0">
                      <div>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '15px', fontWeight: 500 }}>
                          {item.label}
                        </p>
                        <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                          {item.description}
                        </p>
                      </div>
                      <span className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        ₹{item.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t-2 border-[#E2E0EA]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 700 }}>
                        Gross Earnings
                      </span>
                      <span className="text-[#2AB7CA]" style={{ fontSize: '20px', fontWeight: 700 }}>
                        ₹{salaryData.earnings.gross.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E0EA]">
                <h3 className="text-[#1F1B2E] mb-6" style={{ fontSize: '22px', fontWeight: 600 }}>
                  📉 Deductions
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#E2E0EA]">
                    <div>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '15px', fontWeight: 500 }}>
                        Provident Fund (PF)
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                        12% of basic salary
                      </p>
                    </div>
                    <span className="text-[#D64545]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      -₹{salaryData.deductions.pf.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#E2E0EA]">
                    <div>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '15px', fontWeight: 500 }}>
                        Professional Tax (PT)
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                        Fixed amount
                      </p>
                    </div>
                    <span className="text-[#D64545]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      -₹{salaryData.deductions.pt.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-4 mt-4 border-t-2 border-[#E2E0EA]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 700 }}>
                        Total Deductions
                      </span>
                      <span className="text-[#D64545]" style={{ fontSize: '20px', fontWeight: 700 }}>
                        -₹{salaryData.deductions.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Summary */}
              <div className="bg-[#F7F6FB] rounded-2xl p-6 border-2 border-[#2AB7CA]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '14px' }}>
                      Final Amount
                    </p>
                    <p className="text-[#1F1B2E]" style={{ fontSize: '16px' }}>
                      Gross (₹{salaryData.earnings.gross.toFixed(2)}) - Deductions (₹{salaryData.deductions.total.toFixed(2)})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '14px' }}>
                      Net Payable
                    </p>
                    <p className="text-[#2AB7CA]" style={{ fontSize: '28px', fontWeight: 700 }}>
                      ₹{salaryData.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#E2E0EA]">
            <Briefcase className="w-16 h-16 text-[#6E6A7C] mx-auto mb-4" />
            <p className="text-[#6E6A7C]" style={{ fontSize: '18px' }}>
              No salary data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
