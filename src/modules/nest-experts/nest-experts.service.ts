import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UserMasterRepository } from '../../database/user-master.repository';
import { sanitizeUserResponse } from '../../common/utils/sanitizer.util';
import { USER_MASTER_MESSAGES } from '../../common/constants/user-master.constants';
import type { NestExpertUpdateDto, SanitizedUser } from '../user-master/user-master.types';

@Injectable()
export class NestExpertsService {
  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository
  ) {}

  /**
   * Updates an existing user's Nest Expert status in the user_masters table.
   * Touches ONLY the isNestExpert column; all other roles remain untouched.
   */
  async updateNestExpertStatus(dto: NestExpertUpdateDto): Promise<{
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

    // 2. Update ONLY the isNestExpert field
    const updated = await this.userRepository.updateNestExpertRole(
      dto.userId,
      dto.isNestExpert
    );

    return {
      success: true,
      message: USER_MASTER_MESSAGES.NEST_EXPERT_UPDATED_SUCCESS,
      data: sanitizeUserResponse(updated),
    };
  }
}
