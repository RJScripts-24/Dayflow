/**
 * Navbar - Top navigation bar with logo, tabs, role switcher, and user menu
 */

import { useState } from 'react';
import { Building2, Bell, User, LogOut } from 'lucide-react';
import { NAV_HEIGHT, USER_ROLES, type UserRole } from '../../utils/constants';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: Array<{ id: string; label: string }>;
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onNavigateToProfile?: () => void;
  onLogOut: () => void;
  showRoleSwitcher?: boolean;
  showTabs?: boolean;
}

export function Navbar({
  activeTab,
  onTabChange,
  tabs = [],
  userRole,
  onRoleChange,
  onNavigateToProfile,
  onLogOut,
  showRoleSwitcher = false,
  showTabs = false,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#4B2A6A]"
      style={{ height: NAV_HEIGHT, boxShadow: '0 2px 8px rgba(75, 42, 106, 0.12)' }}
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#4B2A6A]" />
          </div>
          <span className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
            Dayflow
          </span>
        </div>

        {/* Navigation Tabs */}
        {showTabs && tabs.length > 0 && (
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-8 lg:ml-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="relative py-5 transition-all duration-200"
                style={{
                  color: activeTab === tab.id ? '#ffffff' : '#B39CD0',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#B39CD0';
                  }
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                    style={{ height: '3px', borderRadius: '2px 2px 0 0' }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Role Switcher */}
        {showRoleSwitcher && userRole && onRoleChange && (
          <div className="hidden lg:flex items-center gap-1 bg-white bg-opacity-10 rounded-lg p-1">
            <button
              onClick={() => onRoleChange(USER_ROLES.EMPLOYEE)}
              className="px-3 lg:px-4 py-1.5 rounded-md transition-all duration-200"
              style={{
                backgroundColor: userRole === USER_ROLES.EMPLOYEE ? '#2AB7CA' : 'transparent',
                color: userRole === USER_ROLES.EMPLOYEE ? '#ffffff' : '#B39CD0',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Employee
            </button>
            <button
              onClick={() => onRoleChange(USER_ROLES.ADMIN)}
              className="px-3 lg:px-4 py-1.5 rounded-md transition-all duration-200"
              style={{
                backgroundColor: userRole === USER_ROLES.ADMIN ? '#2AB7CA' : 'transparent',
                color: userRole === USER_ROLES.ADMIN ? '#ffffff' : '#B39CD0',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Admin
            </button>
          </div>
        )}

        {/* Notifications & User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 hidden md:block">
            <Bell className="w-5 h-5 text-white" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D64545] rounded-full" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 md:w-10 md:h-10 bg-[#2AB7CA] rounded-full flex items-center justify-center hover:bg-[#239BAA] transition-colors"
            >
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-[#E2E0EA]"
                style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', animation: 'fadeInDown 150ms ease-out' }}
              >
                {onNavigateToProfile && (
                  <button
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F7F6FB] transition-colors text-left"
                    onClick={onNavigateToProfile}
                  >
                    <User className="w-4 h-4 text-[#2AB7CA]" />
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                      My Profile
                    </span>
                  </button>
                )}
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F7F6FB] transition-colors text-left"
                  onClick={onLogOut}
                >
                  <LogOut className="w-4 h-4 text-[#2AB7CA]" />
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Log Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
