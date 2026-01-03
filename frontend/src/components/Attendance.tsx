/**
 * Attendance - Admin view for attendance management
 */

import { useState } from 'react';
import { AttendanceTable, type AttendanceRecord } from './tables/AttendanceTable';

export function Attendance() {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <AttendanceTable 
      records={attendanceRecords}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}