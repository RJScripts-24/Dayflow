import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Info } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export function Attendance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('October 22, 2025');

  // Mock attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP-2020-001',
      checkIn: '09:00',
      checkOut: '18:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '2',
      employeeName: 'Michael Chen',
      employeeId: 'EMP-2020-002',
      checkIn: '09:15',
      checkOut: '17:45',
      workHours: '08:30',
      extraHours: '00:30',
    },
    {
      id: '3',
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP-2020-003',
      checkIn: '08:45',
      checkOut: '18:15',
      workHours: '09:30',
      extraHours: '01:30',
    },
    {
      id: '4',
      employeeName: 'David Kim',
      employeeId: 'EMP-2020-004',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '5',
      employeeName: 'Jessica Martinez',
      employeeId: 'EMP-2020-005',
      checkIn: '09:30',
      checkOut: '18:30',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '6',
      employeeName: 'Robert Taylor',
      employeeId: 'EMP-2020-006',
      checkIn: '09:00',
      checkOut: '17:30',
      workHours: '08:30',
      extraHours: '00:30',
    },
    {
      id: '7',
      employeeName: 'Amanda Wilson',
      employeeId: 'EMP-2020-007',
      checkIn: '08:30',
      checkOut: '17:30',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '8',
      employeeName: 'James Anderson',
      employeeId: 'EMP-2020-008',
      checkIn: '09:15',
      checkOut: '18:15',
      workHours: '09:00',
      extraHours: '01:00',
    },
  ];

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-4 md:p-6 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[#1F1B2E] mb-1" style={{ fontSize: '20px', fontWeight: 600 }}>
              Attendance
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
              Day-wise employee attendance records
            </p>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6E6A7C]" />
            <input
              type="text"
              placeholder="Search employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E2E0EA] rounded-lg w-full md:w-80 text-[#1F1B2E] placeholder-[#6E6A7C] focus:outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-20 transition-all"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Date & View Controls */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-3 md:p-4 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Previous Day Button */}
          <button
            className="p-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4 text-[#1F1B2E]" />
          </button>

          {/* Next Day Button */}
          <button
            className="p-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4 text-[#1F1B2E]" />
          </button>

          {/* Date Selector */}
          <button
            className="px-3 md:px-4 py-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all flex items-center gap-2 flex-1 md:flex-none justify-center"
            style={{ fontSize: '13px', color: '#1F1B2E', fontWeight: 500 }}
          >
            <span className="truncate">{selectedDate}</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>

          {/* View Toggle */}
          <button
            className="px-4 py-2 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-all"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Day
          </button>
        </div>
      </div>

      {/* Attendance Table */}
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
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Employee
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Check In
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Check Out
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  Work Hours
                </th>
                <th
                  className="px-6 py-4 text-center text-[#1F1B2E]"
                  style={{ fontSize: '13px', fontWeight: 600 }}
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
                      <p className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                        {record.employeeName}
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                        {record.employeeId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.checkIn}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.checkOut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-[#1F1B2E]"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      {record.workHours}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                      {record.extraHours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Trust Note */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-4 border border-[#E2E0EA] flex items-start gap-3"
      >
        <Info className="w-4 h-4 text-[#2AB7CA] mt-0.5 flex-shrink-0" />
        <p className="text-[#6E6A7C]" style={{ fontSize: '13px', lineHeight: '1.6' }}>
          Attendance records are used to calculate payable days for payroll. All times are recorded 
          in the employee's local timezone and verified through biometric or digital check-in systems.
        </p>
      </div>
    </div>
  );
}