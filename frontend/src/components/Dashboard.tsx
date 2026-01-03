import { useState } from 'react';
import { Building2, Bell, User, LogOut, Calendar, Clock, Users, TrendingUp, Plane, Settings, Plus, Search } from 'lucide-react';
import { Attendance } from './Attendance';
import { EmployeeAttendance } from './EmployeeAttendance';
import { TimeOffAdmin } from './TimeOffAdmin';
import { TimeOffEmployee } from './TimeOffEmployee';

interface DashboardProps {
  onLogOut: () => void;
  onNavigateToProfile: () => void;
  onNavigateToEmployeeProfile: () => void;
  userRole: 'admin' | 'employee';
  onRoleChange: (role: 'admin' | 'employee') => void;
}

type TabType = 'employees' | 'attendance' | 'timeoff';

type EmployeeStatus = 'present' | 'on-leave' | 'absent' | 'not-checked-in';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatar?: string;
  checkInTime?: string;
}

// Employee Card Component
function EmployeeCard({ employee, onClick }: { employee: Employee; onClick: () => void }) {
  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case 'present':
        return '#2E8B57';
      case 'on-leave':
        return '#E6A23C';
      case 'absent':
        return '#D64545';
      case 'not-checked-in':
        return '#6E6A7C';
      default:
        return '#6E6A7C';
    }
  };

  const getStatusLabel = (status: EmployeeStatus) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'on-leave':
        return 'On Leave';
      case 'absent':
        return 'Absent';
      case 'not-checked-in':
        return 'Not Checked In';
      default:
        return status;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#F7F6FB] rounded-lg p-8 border border-[#D5D3DE] hover:border-[#2AB7CA] hover:shadow-sm transition-all cursor-pointer"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}
    >
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div
          className="w-24 h-24 bg-[#E8E3F3] rounded-full flex items-center justify-center flex-shrink-0"
        >
          <User className="w-12 h-12 text-[#4B2A6A]" />
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[#1F1B2E] mb-2 truncate"
            style={{ fontSize: '27px', fontWeight: 600 }}
          >
            {employee.name}
          </h3>
          <p className="text-[#6E6A7C] opacity-85 mb-2 truncate" style={{ fontSize: '22px' }}>
            {employee.role}
          </p>
          <p className="text-[#6E6A7C] opacity-70 truncate" style={{ fontSize: '21px' }}>
            {employee.department}
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-3 mt-5">
            {employee.status === 'on-leave' ? (
              <Plane className="w-6 h-6" style={{ color: getStatusColor(employee.status), opacity: 0.9 }} />
            ) : (
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(employee.status),
                  boxShadow: `0 0 3px ${getStatusColor(employee.status)}30`,
                }}
              />
            )}
            <span
              style={{ fontSize: '21px', fontWeight: 500, color: getStatusColor(employee.status), opacity: 0.9 }}
            >
              {getStatusLabel(employee.status)}
            </span>
          </div>

          {/* Check-in time if present */}
          {employee.status === 'present' && employee.checkInTime && (
            <p className="text-[#6E6A7C] opacity-60 mt-3" style={{ fontSize: '20px' }}>
              Checked in at {employee.checkInTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ onLogOut, onNavigateToProfile, onNavigateToEmployeeProfile, userRole, onRoleChange }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const mockEmployees: Employee[] = [
    { id: '1', name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', status: 'present', checkInTime: '09:00 AM' },
    { id: '2', name: 'Michael Chen', role: 'Product Manager', department: 'Product', status: 'on-leave' },
    { id: '3', name: 'Emily Rodriguez', role: 'UX Designer', department: 'Design', status: 'present', checkInTime: '08:45 AM' },
    { id: '4', name: 'James Wilson', role: 'HR Manager', department: 'Human Resources', status: 'not-checked-in' },
    { id: '5', name: 'Lisa Anderson', role: 'Marketing Lead', department: 'Marketing', status: 'absent' },
    { id: '6', name: 'David Kim', role: 'Backend Developer', department: 'Engineering', status: 'present', checkInTime: '09:15 AM' },
    { id: '7', name: 'Jessica Brown', role: 'Sales Executive', department: 'Sales', status: 'present', checkInTime: '08:30 AM' },
    { id: '8', name: 'Robert Taylor', role: 'DevOps Engineer', department: 'Engineering', status: 'not-checked-in' },
    { id: '9', name: 'Amanda White', role: 'Content Writer', department: 'Marketing', status: 'on-leave' },
  ];

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setCheckedIn(true);
    setCheckInTime(timeString);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckInTime(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Top Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#4B2A6A]"
        style={{ height: '108px', boxShadow: '0 2px 8px rgba(75, 42, 106, 0.12)' }}
      >
        <div className="h-full px-8 md:px-12 flex items-center justify-between">
          {/* Left: Logo & Company Name */}
          <div className="flex items-center gap-5 md:gap-6">
            <div className="w-16 h-16 md:w-18 md:h-18 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-9 h-9 md:w-10 md:h-10 text-[#4B2A6A]" />
            </div>
            <span className="text-white" style={{ fontSize: '26px', fontWeight: 600 }}>
              Dayflow
            </span>
          </div>

          {/* Center/Left: Tabs - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-8 lg:ml-12">
            <button
              onClick={() => setActiveTab('employees')}
              className="relative py-5 transition-all duration-200"
              style={{
                color: activeTab === 'employees' ? '#ffffff' : '#B39CD0',
                fontSize: '24px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'employees') {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'employees') {
                  e.currentTarget.style.color = '#B39CD0';
                }
              }}
            >
              Employees
              {activeTab === 'employees' && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                  style={{ height: '3px', borderRadius: '2px 2px 0 0' }}
                />
              )}
            </button>
            
            {/* Attendance tab - shown for both Admin and Employee */}
            <button
              onClick={() => setActiveTab('attendance')}
              className="relative py-5 transition-all duration-200"
              style={{
                color: activeTab === 'attendance' ? '#ffffff' : '#B39CD0',
                fontSize: '24px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'attendance') {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'attendance') {
                  e.currentTarget.style.color = '#B39CD0';
                }
              }}
            >
              Attendance
              {activeTab === 'attendance' && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                  style={{ height: '3px', borderRadius: '2px 2px 0 0' }}
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('timeoff')}
              className="relative py-5 transition-all duration-200"
              style={{
                color: activeTab === 'timeoff' ? '#ffffff' : '#B39CD0',
                fontSize: '24px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'timeoff') {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'timeoff') {
                  e.currentTarget.style.color = '#B39CD0';
                }
              }}
            >
              Time Off
              {activeTab === 'timeoff' && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                  style={{ height: '3px', borderRadius: '2px 2px 0 0' }}
                />
              )}
            </button>
          </div>

          {/* Center-Right: Role Switcher - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 bg-white bg-opacity-10 rounded-lg p-2">
            <button
              onClick={() => onRoleChange('employee')}
              className="px-6 lg:px-8 py-3 rounded-md transition-all duration-200"
              style={{
                backgroundColor: userRole === 'employee' ? '#2AB7CA' : 'transparent',
                color: userRole === 'employee' ? '#ffffff' : '#B39CD0',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              Employee
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className="px-6 lg:px-8 py-3 rounded-md transition-all duration-200"
              style={{
                backgroundColor: userRole === 'admin' ? '#2AB7CA' : 'transparent',
                color: userRole === 'admin' ? '#ffffff' : '#B39CD0',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              Admin
            </button>
          </div>

          {/* Right: Notification & User Avatar */}
          <div className="flex items-center gap-5 md:gap-7">
            <button className="relative p-4 hidden md:block">
              <Bell className="w-9 h-9 text-white" />
              <div className="absolute top-3 right-3 w-4 h-4 bg-[#D64545] rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-16 h-16 md:w-18 md:h-18 bg-[#2AB7CA] rounded-full flex items-center justify-center hover:bg-[#239BAA] transition-colors"
              >
                <User className="w-8 h-8 md:w-9 md:h-9 text-white" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg overflow-hidden border border-[#E2E0EA]"
                  style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', animation: 'fadeInDown 150ms ease-out' }}
                >
                  <button
                    className="w-full px-7 py-5 flex items-center gap-4 hover:bg-[#F7F6FB] transition-colors text-left"
                    onClick={onNavigateToProfile}
                  >
                    <User className="w-7 h-7 text-[#2AB7CA]" />
                    <span className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 500 }}>
                      My Profile
                    </span>
                  </button>
                  <button
                    className="w-full px-7 py-5 flex items-center gap-4 hover:bg-[#F7F6FB] transition-colors text-left"
                    onClick={onLogOut}
                  >
                    <LogOut className="w-7 h-7 text-[#2AB7CA]" />
                    <span className="text-[#1F1B2E]" style={{ fontSize: '24px', fontWeight: 500 }}>
                      Log Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-32 pb-16 md:pb-16 pb-36">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-8 md:py-16">
          {activeTab === 'employees' ? (
            <>
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-14 gap-8">
                <div>
                  <h1 className="text-[#1F1B2E] mb-2" style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                    Employees
                  </h1>
                  <p className="text-[#6E6A7C]" style={{ fontSize: '24px' }}>
                    Manage employee records and attendance
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-[#6E6A7C]" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-16 pr-8 py-5 border border-[#E2E0EA] rounded-lg bg-white outline-none focus:border-[#2AB7CA] focus:ring-2 focus:ring-[#2AB7CA] focus:ring-opacity-10 transition-all w-full md:w-[480px]"
                      style={{ fontSize: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                    />
                  </div>

                  {/* New Button */}
                  <button
                    className="px-8 py-5 bg-[#2AB7CA] text-white rounded-lg flex items-center gap-4 hover:bg-[#239BAA] transition-all duration-200 whitespace-nowrap"
                    style={{ fontSize: '24px', fontWeight: 500, boxShadow: '0 2px 8px rgba(42, 183, 202, 0.15)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(42, 183, 202, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(42, 183, 202, 0.15)';
                    }}
                  >
                    <Plus className="w-8 h-8" />
                    New
                  </button>
                </div>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:pr-80">
                {mockEmployees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} onClick={onNavigateToEmployeeProfile} />
                ))}
              </div>
            </>
          ) : activeTab === 'attendance' ? (
            userRole === 'admin' ? <Attendance /> : <EmployeeAttendance />
          ) : (
            userRole === 'admin' ? <TimeOffAdmin /> : <TimeOffEmployee />
          )}
        </div>
      </div>

      {/* Check-In/Check-Out Panel (Right Side) - Only show in Employees tab and on xl screens */}
      {activeTab === 'employees' && (
        <div
          className="hidden xl:block fixed right-12 w-96 bg-[#F7F6FB] rounded-xl p-8 border border-[#E8E6F0]"
          style={{ top: 'calc(8rem + 30px)', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}
        >
          <h3 className="text-[#1F1B2E] mb-6" style={{ fontSize: '26px', fontWeight: 600 }}>
            Quick Actions
          </h3>

          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full py-5 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-all duration-200"
              style={{ fontSize: '24px', fontWeight: 500, boxShadow: '0 2px 6px rgba(42, 183, 202, 0.2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(42, 183, 202, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(42, 183, 202, 0.2)';
              }}
            >
              Check In
            </button>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-5 bg-[#E8F5E9] rounded-lg border border-[#C8E6C9]">
                <div className="w-4 h-4 bg-[#2E8B57] rounded-full" style={{ boxShadow: '0 0 6px rgba(46, 139, 87, 0.4)' }} />
                <span className="text-[#1F1B2E]" style={{ fontSize: '22px' }}>
                  Checked in at {checkInTime}
                </span>
              </div>
              <button
                onClick={handleCheckOut}
                className="w-full py-5 bg-[#E2E0EA] text-[#1F1B2E] rounded-lg hover:bg-[#C9C7D3] transition-colors"
                style={{ fontSize: '24px', fontWeight: 500 }}
              >
                Check Out
              </button>
            </div>
          )}

          <div className="mt-8 pt-7 border-t border-[#E2E0EA]">
            <p className="text-[#6E6A7C] mb-4" style={{ fontSize: '20px', fontWeight: 500 }}>
              STATUS INDICATORS
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-[#2E8B57] rounded-full" style={{ boxShadow: '0 0 4px rgba(46, 139, 87, 0.3)' }} />
                <span className="text-[#6E6A7C]" style={{ fontSize: '21px' }}>
                  Present
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Plane className="w-6 h-6 text-[#4C7D9A]" />
                <span className="text-[#6E6A7C]" style={{ fontSize: '21px' }}>
                  On Leave
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-[#E6A23C] rounded-full" style={{ boxShadow: '0 0 4px rgba(230, 162, 60, 0.3)' }} />
                <span className="text-[#6E6A7C]" style={{ fontSize: '21px' }}>
                  Absent
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-[#D64545] rounded-full" style={{ boxShadow: '0 0 4px rgba(214, 69, 69, 0.3)' }} />
                <span className="text-[#6E6A7C]" style={{ fontSize: '21px' }}>
                  Not Checked In
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Link (Bottom Left) */}
      <button
        className="fixed bottom-12 left-12 w-20 h-20 bg-white rounded-lg flex items-center justify-center hover:bg-[#F7F6FB] transition-colors border border-[#E2E0EA] hidden md:flex"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
      >
        <Settings className="w-9 h-9 text-[#6E6A7C]" />
      </button>

      {/* Mobile Bottom Navigation - shown on mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E0EA] z-40" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center justify-around px-3 py-6">
          <button
            onClick={() => setActiveTab('employees')}
            className="flex flex-col items-center gap-2 px-5 py-3 rounded-lg transition-all"
            style={{
              color: activeTab === 'employees' ? '#2AB7CA' : '#6E6A7C',
            }}
          >
            <Users className="w-9 h-9" />
            <span style={{ fontSize: '20px', fontWeight: 500 }}>Employees</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex flex-col items-center gap-2 px-5 py-3 rounded-lg transition-all"
            style={{
              color: activeTab === 'attendance' ? '#2AB7CA' : '#6E6A7C',
            }}
          >
            <Clock className="w-9 h-9" />
            <span style={{ fontSize: '20px', fontWeight: 500 }}>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('timeoff')}
            className="flex flex-col items-center gap-2 px-5 py-3 rounded-lg transition-all"
            style={{
              color: activeTab === 'timeoff' ? '#2AB7CA' : '#6E6A7C',
            }}
          >
            <Calendar className="w-9 h-9" />
            <span style={{ fontSize: '20px', fontWeight: 500 }}>Time Off</span>
          </button>
        </div>
      </div>
    </div>
  );
}