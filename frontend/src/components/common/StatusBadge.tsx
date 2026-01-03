/**
 * StatusBadge - Displays a status indicator with appropriate styling
 */

import { Plane } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import type { EmployeeStatus } from '../../utils/constants';

interface StatusBadgeProps {
  status: EmployeeStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <div className="flex items-center gap-1.5">
      {showIcon && status === 'on-leave' ? (
        <Plane className="w-3 h-3" style={{ color, opacity: 0.9 }} />
      ) : showIcon ? (
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 3px ${color}30`,
          }}
        />
      ) : null}
      <span style={{ fontSize: '11px', fontWeight: 500, color, opacity: 0.9 }}>
        {label}
      </span>
    </div>
  );
}
