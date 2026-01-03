import { User, Plane } from 'lucide-react';

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

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const getStatusIndicator = (status: EmployeeStatus) => {
    switch (status) {
      case 'present':
        return <div className="w-3 h-3 bg-[#47A044] rounded-full" style={{ boxShadow: '0 0 6px rgba(71, 160, 68, 0.4)' }} />;
      case 'on-leave':
        return <Plane className="w-4 h-4 text-[#3282B8]" />;
      case 'absent':
        return <div className="w-3 h-3 bg-[#F59E0B] rounded-full" style={{ boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)' }} />;
      case 'not-checked-in':
        return <div className="w-3 h-3 bg-[#DC2626] rounded-full" style={{ boxShadow: '0 0 6px rgba(220, 38, 38, 0.4)' }} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg border border-[#E8EBED] hover:border-[#3282B8]"
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
    >
      {/* Status Indicator (Top-Right) */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-[#F8F9FA] rounded-full flex items-center justify-center border border-[#E5E7EB]">
          {employee.avatar ? (
            <img src={employee.avatar} alt={employee.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-[#7F8C8D]" />
          )}
        </div>
        <div className="mt-1">
          {getStatusIndicator(employee.status)}
        </div>
      </div>

      {/* Employee Name */}
      <h3 className="text-[#1B262C] mb-1" style={{ fontSize: '15px', fontWeight: 600 }}>
        {employee.name}
      </h3>

      {/* Role */}
      <p className="text-[#7F8C8D] mb-0.5" style={{ fontSize: '13px' }}>
        {employee.role}
      </p>

      {/* Department */}
      <p className="text-[#7F8C8D]" style={{ fontSize: '12px', opacity: 0.8 }}>
        {employee.department}
      </p>

      {/* Check-in Time (if present) */}
      {employee.checkInTime && employee.status === 'present' && (
        <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
          <p className="text-[#7F8C8D]" style={{ fontSize: '11px' }}>
            Checked in at {employee.checkInTime}
          </p>
        </div>
      )}
    </div>
  );
}