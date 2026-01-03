/**
 * Application-wide constants
 * Centralized location for magic strings and configuration values
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Employee status types
export const EMPLOYEE_STATUS = {
  PRESENT: 'present',
  ON_LEAVE: 'on-leave',
  ABSENT: 'absent',
  NOT_CHECKED_IN: 'not-checked-in',
} as const;

export type EmployeeStatus = typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS];

// Time off request status
export const TIME_OFF_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type TimeOffStatus = typeof TIME_OFF_STATUS[keyof typeof TIME_OFF_STATUS];

// Time off types
export const TIME_OFF_TYPES = {
  PAID: 'Paid Time Off',
  SICK: 'Sick Time Off',
} as const;

export type TimeOffType = typeof TIME_OFF_TYPES[keyof typeof TIME_OFF_TYPES];

// Status labels for display
export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  [EMPLOYEE_STATUS.PRESENT]: 'Present',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'On Leave',
  [EMPLOYEE_STATUS.ABSENT]: 'Absent',
  [EMPLOYEE_STATUS.NOT_CHECKED_IN]: 'Not Checked In',
};

// Status colors
export const STATUS_COLORS: Record<EmployeeStatus, string> = {
  [EMPLOYEE_STATUS.PRESENT]: '#2E8B57',
  [EMPLOYEE_STATUS.ON_LEAVE]: '#E6A23C',
  [EMPLOYEE_STATUS.ABSENT]: '#D64545',
  [EMPLOYEE_STATUS.NOT_CHECKED_IN]: '#6E6A7C',
};

// Time off status colors
export const TIME_OFF_STATUS_COLORS: Record<TimeOffStatus, string> = {
  [TIME_OFF_STATUS.PENDING]: '#E6A23C',
  [TIME_OFF_STATUS.APPROVED]: '#2E8B57',
  [TIME_OFF_STATUS.REJECTED]: '#D64545',
};

// Time off status labels
export const TIME_OFF_STATUS_LABELS: Record<TimeOffStatus, string> = {
  [TIME_OFF_STATUS.PENDING]: 'Pending',
  [TIME_OFF_STATUS.APPROVED]: 'Approved',
  [TIME_OFF_STATUS.REJECTED]: 'Rejected',
};

// Navigation bar height
export const NAV_HEIGHT = '64px';

// Table column headers
export const ATTENDANCE_TABLE_HEADERS = [
  'Employee Name',
  'Employee ID',
  'Check In',
  'Check Out',
  'Work Hours',
  'Extra Hours',
];
