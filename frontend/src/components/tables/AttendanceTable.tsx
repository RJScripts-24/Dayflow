/**
 * AttendanceTable - Displays attendance records in a table format
 */

import { Search, ChevronLeft, ChevronRight, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AttendanceTable({ records, searchQuery, onSearchChange }: AttendanceTableProps) {
  const [selectedDate, setSelectedDate] = useState('October 22, 2025');

  const filteredRecords = records.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-6 md:p-8 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[#1F1B2E] mb-2" style={{ fontSize: '28px', fontWeight: 600 }}>
              Attendance
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '18px' }}>
              Day-wise employee attendance records
            </p>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6E6A7C]" />
            <input
              type="text"
              placeholder="Search employee name or ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 border border-[#E2E0EA] rounded-lg w-full md:w-[400px] text-[#1F1B2E] placeholder-[#6E6A7C] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>
      </div>

      {/* Date & View Controls */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-4 md:p-6 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <button
            className="p-2.5 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 text-[#1F1B2E]" />
          </button>

          <button
            className="p-2.5 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 text-[#1F1B2E]" />
          </button>

          <button
            className="px-4 md:px-6 py-2.5 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all flex items-center gap-2 flex-1 md:flex-none justify-center"
            style={{ fontSize: '16px', color: '#1F1B2E', fontWeight: 500 }}
          >
            <span className="truncate">{selectedDate}</span>
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          </button>

          <button
            className="px-6 py-2.5 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-all"
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            Day
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-[#F7F6FB] rounded-xl border border-[#E2E0EA] overflow-hidden"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-[#E2E0EA]">
                <th
                  className="px-6 py-4 text-left text-[#1F1B2E]"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  Employee
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  Check In
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  Check Out
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  Work Hours
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  Extra Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className="border-b border-[#E2E0EA] hover:bg-white transition-colors cursor-pointer"
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F7F6FB' : '#FFFFFF',
                  }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 500 }}>
                        {record.employeeName}
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                        {record.employeeId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '16px' }}>
                      {record.checkIn}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '16px' }}>
                      {record.checkOut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-[#1F1B2E]"
                      style={{ fontSize: '16px', fontWeight: 500 }}
                    >
                      {record.workHours}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '16px' }}>
                      {record.extraHours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA] flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-[#2AB7CA] mt-0.5 flex-shrink-0" />
        <p className="text-[#6E6A7C]" style={{ fontSize: '15px', lineHeight: '1.6' }}>
          Attendance records are used to calculate payable days for payroll. All times are recorded 
          in the employee's local timezone and verified through biometric or digital check-in systems.
        </p>
      </div>
    </div>
  );
}
