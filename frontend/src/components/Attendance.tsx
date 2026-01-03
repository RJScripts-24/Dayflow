/**
 * Attendance - Admin view for attendance management
 */

import { useState, useEffect } from 'react';
import { AttendanceTable, type AttendanceRecord } from './tables/AttendanceTable';
import { AdminService } from '../services';

interface AttendanceProps {
  onNavigateToSalaryDetail?: (params: { employeeId: string; employeeName: string; month?: number; year?: number }) => void;
}

export function Attendance({ onNavigateToSalaryDetail }: AttendanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
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
      const data = await AdminService.getAllAttendance();
      
      // Format the data to match AttendanceRecord type
      const formattedRecords: AttendanceRecord[] = data.map((record: any) => ({
        id: record.id.toString(),
        employeeName: record.employeeName,
        employeeId: record.employeeId,
        checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
        checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
        workHours: record.workHours ? formatHours(record.workHours) : '-',
        extraHours: record.workHours ? calculateExtraHours(record.workHours) : '-',
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
    <AttendanceTable 
      records={attendanceRecords}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onNavigateToSalaryDetail={onNavigateToSalaryDetail}
    />
  );
}