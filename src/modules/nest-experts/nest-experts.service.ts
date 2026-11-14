import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UserMasterRepository } from '../../database/user-master.repository';
import type { NestExpertUpdateDto, NestExpertResponse, SanitizedNestExpert } from './nest-experts.types';
import { NEST_EXPERT_MESSAGES } from './nest-experts.types';

@Injectable()
export class NestExpertsService {
  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository,
  ) {}

  /**
   * Sanitizes nest expert response: strips password.
   */
  private sanitizeNestExpert(user: any): SanitizedNestExpert {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeData } = user;
    return safeData as SanitizedNestExpert;
  }

  /**
   * Updates an existing user's Nest Expert status in the user_masters table.
   * Direct single-query update catching P2025 (RecordNotFound) eliminates 1 DB round-trip.
   */
  async updateNestExpertStatus(dto: NestExpertUpdateDto): Promise<NestExpertResponse> {
    try {
      const updated = await this.userRepository.updateNestExpertRole(
        dto.userId,
        dto.isNestExpert,
      );

      return {
        success: true,
        message: NEST_EXPERT_MESSAGES.UPDATED_SUCCESS,
        data: this.sanitizeNestExpert(updated),
      };
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException({
          success: false,
          message: NEST_EXPERT_MESSAGES.USER_NOT_FOUND,
          errors: [],
        });
      }
      throw err;
    }
  }
}
