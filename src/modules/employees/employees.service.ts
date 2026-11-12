import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UserMasterRepository } from '../../database/user-master.repository';
import { sanitizeUserResponse } from '../../common/utils/sanitizer.util';
import { USER_MASTER_MESSAGES } from '../../common/constants/user-master.constants';
import type { EmployeeUpdateDto, SanitizedUser } from '../user-master/user-master.types';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository
  ) {}

  /**
   * Updates an existing user's employee status in the user_masters table.
   * Touches ONLY the isHaatzaEmployee column; all other roles remain untouched.
   */
  async updateEmployeeStatus(dto: EmployeeUpdateDto): Promise<{
    success: boolean;
    message: string;
    data: SanitizedUser;
  }> {
    // 1. Check if user exists in database through repository
    const existing = await this.userRepository.findById(dto.userId);

    if (!existing) {
      throw new NotFoundException({
        success: false,
        message: USER_MASTER_MESSAGES.USER_NOT_FOUND,
        errors: [],
      });
    }

    // 2. Update ONLY the isHaatzaEmployee field
    const updated = await this.userRepository.updateEmployeeRole(
      dto.userId,
      dto.isHaatzaEmployee
    );

    return {
      success: true,
      message: USER_MASTER_MESSAGES.EMPLOYEE_UPDATED_SUCCESS,
      data: sanitizeUserResponse(updated),
    };
  }
}
