/**
 * QuickActionsPanel - Sidebar panel for check-in/check-out and status indicators
 */

import { Plane } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatTime } from '../../utils/formatters';
import { EmployeeService } from '../../services';

export function QuickActionsPanel() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user has already checked in today
  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const history = await EmployeeService.getAttendanceHistory();
      const today = new Date().toISOString().split('T')[0];
      
      // Find today's record
      const todayRecord = history.find((record: any) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });

      if (todayRecord && todayRecord.check_in_time) {
        setIsCheckedIn(!todayRecord.check_out_time); // Only show as checked in if not checked out
        if (!todayRecord.check_out_time) {
          const checkIn = new Date(todayRecord.check_in_time);
          setCheckInTime(formatTime(checkIn));
        }
      }
    } catch (error) {
      console.error('Failed to check today\'s attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await EmployeeService.markAttendance();
      const time = formatTime(new Date());
      setIsCheckedIn(true);
      setCheckInTime(time);
    } catch (error: any) {
      console.error('Check-in failed:', error);
      alert(error.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await EmployeeService.markAttendance();
      setIsCheckedIn(false);
      setCheckInTime(null);
    } catch (error: any) {
      console.error('Check-out failed:', error);
      alert(error.message || 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hidden xl:block fixed right-6 w-64 bg-[#F7F6FB] rounded-xl p-4 border border-[#E8E6F0]"
      style={{ top: 'calc(8rem + 30px)', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}
    >
      <h3 className="text-[#1F1B2E] mb-3.5" style={{ fontSize: '15px', fontWeight: 600 }}>
        Quick Actions
      </h3>

      {!isCheckedIn ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="w-full py-3 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 6px rgba(42, 183, 202, 0.2)' }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.boxShadow = '0 4px 10px rgba(42, 183, 202, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(42, 183, 202, 0.2)';
          }}
        >
          {loading ? 'Processing...' : 'Check In'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-[#E8F5E9] rounded-lg border border-[#C8E6C9]">
            <div 
              className="w-2 h-2 bg-[#2E8B57] rounded-full" 
              style={{ boxShadow: '0 0 6px rgba(46, 139, 87, 0.4)' }} 
            />
            <span className="text-[#1F1B2E]" style={{ fontSize: '13px' }}>
              Checked in at {checkInTime}
            </span>
          </div>
          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="w-full py-3 bg-[#E2E0EA] text-[#1F1B2E] rounded-lg hover:bg-[#C9C7D3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            {loading ? 'Processing...' : 'Check Out'}
          </button>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-[#E2E0EA]">
        <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
          STATUS INDICATORS
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 bg-[#2E8B57] rounded-full" 
              style={{ boxShadow: '0 0 4px rgba(46, 139, 87, 0.3)' }} 
            />
            <span className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
              Present
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="w-3 h-3 text-[#4C7D9A]" />
            <span className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
              On Leave
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 bg-[#E6A23C] rounded-full" 
              style={{ boxShadow: '0 0 4px rgba(230, 162, 60, 0.3)' }} 
            />
            <span className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
              Absent
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 bg-[#D64545] rounded-full" 
              style={{ boxShadow: '0 0 4px rgba(214, 69, 69, 0.3)' }} 
            />
            <span className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
              Not Checked In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
