import type { UserMaster } from '../../generated/prisma/client';

export interface EmployeeUpdateDto {
  userId: string;
  isHaatzaEmployee: boolean;
}

export type SanitizedEmployee = Omit<UserMaster, 'password'>;

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: SanitizedEmployee;
}

export const EMPLOYEE_MESSAGES = {
  UPDATED_SUCCESS: 'Haatza employee status updated successfully',
  USER_NOT_FOUND: 'User not found with the specified userId',
} as const;

