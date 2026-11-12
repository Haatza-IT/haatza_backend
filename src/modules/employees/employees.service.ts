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
   * Touches ONLY the isHaatzaEmployee column; all other roles remain untouched.
   */
  async updateEmployeeStatus(dto: EmployeeUpdateDto): Promise<EmployeeResponse> {
    // 1. Verify user exists in database
    const existing = await this.userRepository.findById(dto.userId);
    if (!existing) {
      throw new NotFoundException({
        success: false,
        message: EMPLOYEE_MESSAGES.USER_NOT_FOUND,
        errors: [],
      });
    }

    // 2. Update ONLY the isHaatzaEmployee field
    const updated = await this.userRepository.updateEmployeeRole(
      dto.userId,
      dto.isHaatzaEmployee,
    );

    return {
      success: true,
      message: EMPLOYEE_MESSAGES.UPDATED_SUCCESS,
      data: this.sanitizeEmployee(updated),
    };
  }
}
