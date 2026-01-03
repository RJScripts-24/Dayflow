/**
 * DashboardPage - Main dashboard page with tabs for employees, attendance, and time off
 */

import { useState } from 'react';
import { Settings, Users, Clock, Calendar, Plus } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import { EmployeeCard, type Employee } from '../components/common/EmployeeCard';
import { QuickActionsPanel } from '../components/common/QuickActionsPanel';
import { Attendance } from '../components/Attendance';
import { EmployeeAttendance } from '../components/EmployeeAttendance';
import { TimeOffAdmin } from '../components/TimeOffAdmin';
import { TimeOffEmployee } from '../components/TimeOffEmployee';
import { USER_ROLES, EMPLOYEE_STATUS, type UserRole } from '../utils/constants';

interface DashboardPageProps {
  onLogOut: () => void;
  onNavigateToProfile: () => void;
  onNavigateToEmployeeProfile: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

type TabType = 'employees' | 'attendance' | 'timeoff';

export function DashboardPage({ 
  onLogOut, 
  onNavigateToProfile, 
  onNavigateToEmployeeProfile, 
  userRole, 
  onRoleChange 
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = userRole === USER_ROLES.ADMIN;

  // Mock employee data
  const employeeList: Employee[] = [
    { id: '1', name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', status: EMPLOYEE_STATUS.PRESENT, checkInTime: '09:00 AM' },
    { id: '2', name: 'Michael Chen', role: 'Product Manager', department: 'Product', status: EMPLOYEE_STATUS.ON_LEAVE },
    { id: '3', name: 'Emily Rodriguez', role: 'UX Designer', department: 'Design', status: EMPLOYEE_STATUS.PRESENT, checkInTime: '08:45 AM' },
    { id: '4', name: 'James Wilson', role: 'HR Manager', department: 'Human Resources', status: EMPLOYEE_STATUS.NOT_CHECKED_IN },
    { id: '5', name: 'Lisa Anderson', role: 'Marketing Lead', department: 'Marketing', status: EMPLOYEE_STATUS.ABSENT },
    { id: '6', name: 'David Kim', role: 'Backend Developer', department: 'Engineering', status: EMPLOYEE_STATUS.PRESENT, checkInTime: '09:15 AM' },
    { id: '7', name: 'Jessica Brown', role: 'Sales Executive', department: 'Sales', status: EMPLOYEE_STATUS.PRESENT, checkInTime: '08:30 AM' },
    { id: '8', name: 'Robert Taylor', role: 'DevOps Engineer', department: 'Engineering', status: EMPLOYEE_STATUS.NOT_CHECKED_IN },
    { id: '9', name: 'Amanda White', role: 'Content Writer', department: 'Marketing', status: EMPLOYEE_STATUS.ON_LEAVE },
  ];

  const navigationTabs = [
    { id: 'employees', label: 'Employees' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'timeoff', label: 'Time Off' },
  ];

  const mobileNavTabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'timeoff', label: 'Time Off', icon: Calendar },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return isAdmin ? <Attendance /> : <EmployeeAttendance />;
      case 'timeoff':
        return isAdmin ? <TimeOffAdmin /> : <TimeOffEmployee />;
      case 'employees':
      default:
        return (
          <>
            <PageHeader
              title="Employees"
              description="Manage employee records and attendance"
              actions={
                <>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search employees..."
                    className="flex-1 md:flex-none md:w-[280px]"
                  />
                  <Button icon={Plus}>New</Button>
                </>
              }
            />

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:pr-80">
              {employeeList.map((employee) => (
                <EmployeeCard 
                  key={employee.id} 
                  employee={employee} 
                  onClick={onNavigateToEmployeeProfile} 
                />
              ))}
            </div>

            {/* Quick Actions Panel - Only shown on employees tab */}
            <QuickActionsPanel />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        tabs={navigationTabs}
        userRole={userRole}
        onRoleChange={onRoleChange}
        onNavigateToProfile={onNavigateToProfile}
        onLogOut={onLogOut}
        showRoleSwitcher={true}
        showTabs={true}
      />

      {/* Main Content */}
      <div className="pt-16 pb-8 md:pb-8 pb-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Settings Button */}
      <button
        className="fixed bottom-6 left-6 w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-[#F7F6FB] transition-colors border border-[#E2E0EA] hidden md:flex"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
      >
        <Settings className="w-5 h-5 text-[#6E6A7C]" />
      </button>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        tabs={mobileNavTabs}
      />
    </div>
  );
}
