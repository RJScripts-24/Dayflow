/**
 * General helper functions
 */

import { 
  EMPLOYEE_STATUS, 
  STATUS_COLORS, 
  STATUS_LABELS,
  TIME_OFF_STATUS_COLORS,
  TIME_OFF_STATUS_LABELS,
  type EmployeeStatus, 
  type TimeOffStatus 
} from './constants';

/**
 * Returns the appropriate color for an employee status
 */
export function getStatusColor(status: EmployeeStatus): string {
  return STATUS_COLORS[status] || STATUS_COLORS[EMPLOYEE_STATUS.NOT_CHECKED_IN];
}

/**
 * Returns the display label for an employee status
 */
export function getStatusLabel(status: EmployeeStatus): string {
  return STATUS_LABELS[status] || status;
}

/**
 * Returns the appropriate color for a time off status
 */
export function getTimeOffStatusColor(status: TimeOffStatus): string {
  return TIME_OFF_STATUS_COLORS[status];
}

/**
 * Returns the display label for a time off status
 */
export function getTimeOffStatusLabel(status: TimeOffStatus): string {
  return TIME_OFF_STATUS_LABELS[status];
}

/**
 * Validates if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
