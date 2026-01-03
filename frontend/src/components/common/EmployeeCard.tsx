/**
 * EmployeeCard - Displays employee information with status indicator
 * Used in the employee listing view
 */

import { User, Plane } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import type { EmployeeStatus } from '../../utils/constants';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatar?: string;
  checkInTime?: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#F7F6FB] rounded-lg p-3 border border-[#D5D3DE] hover:border-[#2AB7CA] hover:shadow-sm transition-all cursor-pointer"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-[#E8E3F3] rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-[#4B2A6A]" />
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[#1F1B2E] mb-0.5 truncate"
            style={{ fontSize: '15px', fontWeight: 600 }}
          >
            {employee.name}
          </h3>
          <p className="text-[#6E6A7C] opacity-85 mb-0.5 truncate" style={{ fontSize: '13px' }}>
            {employee.role}
          </p>
          <p className="text-[#6E6A7C] opacity-70 truncate" style={{ fontSize: '12px' }}>
            {employee.department}
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 mt-2.5">
            {employee.status === 'on-leave' ? (
              <Plane 
                className="w-3 h-3" 
                style={{ color: getStatusColor(employee.status), opacity: 0.9 }} 
              />
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: getStatusColor(employee.status),
                  boxShadow: `0 0 3px ${getStatusColor(employee.status)}30`,
                }}
              />
            )}
            <span
              style={{ 
                fontSize: '11px', 
                fontWeight: 500, 
                color: getStatusColor(employee.status), 
                opacity: 0.9 
              }}
            >
              {getStatusLabel(employee.status)}
            </span>
          </div>

          {/* Check-in time if present */}
          {employee.status === 'present' && employee.checkInTime && (
            <p className="text-[#6E6A7C] opacity-60 mt-1.5" style={{ fontSize: '11px' }}>
              Checked in at {employee.checkInTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
