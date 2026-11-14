import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UserMasterRepository } from '../../database/user-master.repository';
import type { EmployeeUpdateDto, EmployeeResponse, SanitizedEmployee } from './employees.types';
import { EMPLOYEE_MESSAGES } from './employees.types';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository,
  ) {}

  /**
   * Sanitizes employee response: strips password.
   */
  private sanitizeEmployee(user: any): SanitizedEmployee {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeData } = user;
    return safeData as SanitizedEmployee;
  }

  /**
   * Updates an existing user's employee status in the user_masters table.
   * Direct single-query update catching P2025 (RecordNotFound) eliminates 1 DB round-trip.
   */
  async updateEmployeeStatus(dto: EmployeeUpdateDto): Promise<EmployeeResponse> {
    try {
      const updated = await this.userRepository.updateEmployeeRole(
        dto.userId,
        dto.isHaatzaEmployee,
      );

      return {
        success: true,
        message: EMPLOYEE_MESSAGES.UPDATED_SUCCESS,
        data: this.sanitizeEmployee(updated),
      };
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException({
          success: false,
          message: EMPLOYEE_MESSAGES.USER_NOT_FOUND,
          errors: [],
        });
      }
      throw err;
    }
  }
}
