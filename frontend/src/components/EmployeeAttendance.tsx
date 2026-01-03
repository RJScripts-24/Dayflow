import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export function EmployeeAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('October 2025');
  const [selectedDate] = useState('22 October 2025');

  // Mock attendance data for the employee
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      date: '28/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '2',
      date: '29/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '3',
      date: '23/10/2025',
      checkIn: '09:00',
      checkOut: '18:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '4',
      date: '22/10/2025',
      checkIn: '09:15',
      checkOut: '18:15',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '5',
      date: '21/10/2025',
      checkIn: '09:00',
      checkOut: '17:30',
      workHours: '08:30',
      extraHours: '00:30',
    },
    {
      id: '6',
      date: '18/10/2025',
      checkIn: '08:45',
      checkOut: '18:00',
      workHours: '09:15',
      extraHours: '01:15',
    },
    {
      id: '7',
      date: '17/10/2025',
      checkIn: '09:30',
      checkOut: '18:30',
      workHours: '09:00',
      extraHours: '01:00',
    },
    {
      id: '8',
      date: '16/10/2025',
      checkIn: '09:00',
      checkOut: '18:00',
      workHours: '09:00',
      extraHours: '01:00',
    },
  ];

  // Summary metrics
  const daysPresent = 8;
  const leavesCount = 2;
  const totalWorkingDays = 22;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-6 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        <div>
          <h1 className="text-[#1F1B2E] mb-1" style={{ fontSize: '24px', fontWeight: 600 }}>
            Attendance
          </h1>
          <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
            Your daily attendance record
          </p>
        </div>
      </div>

      {/* Month & Summary Controls */}
      <div
        className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]"
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
      >
        {/* Month Navigation */}
        <div className="flex items-center gap-3 mb-6">
          {/* Previous Month Button */}
          <button
            className="p-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-[#1F1B2E]" />
          </button>

          {/* Next Month Button */}
          <button
            className="p-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-[#1F1B2E]" />
          </button>

          {/* Month Selector */}
          <button
            className="px-4 py-2 border border-[#E2E0EA] rounded-lg hover:bg-[#E8E3F3] hover:border-[#2AB7CA] transition-all flex items-center gap-2"
            style={{ fontSize: '14px', color: '#1F1B2E', fontWeight: 500 }}
          >
            {selectedMonth}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* Days Present */}
          <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
            <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
              Count of days present
            </p>
            <p className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
              {daysPresent}
            </p>
          </div>

          {/* Leaves Count */}
          <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
            <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
              Leaves count
            </p>
            <p className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
              {leavesCount}
            </p>
          </div>

          {/* Total Working Days */}
          <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
            <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
              Total working days
            </p>
            <p className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 600 }}>
              {totalWorkingDays}
            </p>
          </div>
        </div>
      </div>

      {/* Date Context Row */}
      <div className="text-center">
        <h2 className="text-[#1F1B2E]" style={{ fontSize: '18px', fontWeight: 600 }}>
          {selectedDate}
        </h2>
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
                  Date
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
              {attendanceRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className="border-b border-[#E2E0EA] hover:bg-white transition-colors"
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F7F6FB' : '#FFFFFF',
                  }}
                >
                  <td className="px-6 py-4">
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                      {record.date}
                    </span>
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
    </div>
  );
}
