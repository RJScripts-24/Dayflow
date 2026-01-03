import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { EmployeeService } from '../services';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export function EmployeeAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('January 2026');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real attendance data
  useEffect(() => {
    fetchAttendance();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EmployeeService.getAttendanceHistory();
      
      // Format the data to match AttendanceRecord type
      const formattedRecords: AttendanceRecord[] = data.map((record: any) => ({
        id: record.id?.toString() || '',
        date: new Date(record.date).toLocaleDateString('en-GB'),
        checkIn: record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
        checkOut: record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
        workHours: record.work_hours ? formatHours(record.work_hours) : '-',
        extraHours: record.work_hours ? calculateExtraHours(record.work_hours) : '-',
      }));
      
      setAttendanceRecords(formattedRecords);
    } catch (err: any) {
      console.error('Error fetching attendance:', err);
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format hours from decimal to HH:MM
  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Helper to calculate extra hours (assuming 8 hours is standard)
  const calculateExtraHours = (workHours: number): string => {
    const extra = Math.max(0, workHours - 8);
    return formatHours(extra);
  };

  // Calculate summary metrics
  const daysPresent = attendanceRecords.length;
  const leavesCount = 0; // This would come from a separate API
  const totalWorkingDays = 22; // This should be calculated based on the month

  if (loading && attendanceRecords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6E6A7C]">Loading attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#D64545]">{error}</p>
      </div>
    );
  }

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
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                    No attendance records found. Check in to start tracking your attendance.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record, index) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
