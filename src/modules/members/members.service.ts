import { Injectable, ConflictException, Inject } from '@nestjs/common';
import crypto from 'crypto';
import { UserMasterRepository } from '../../database/user-master.repository';
import { hashPassword } from '../../common/utils/password.util';
import { generateRandomReferralCode } from '../../common/utils/code-generator.util';
import { sanitizeUserResponse } from '../../common/utils/sanitizer.util';
import { USER_MASTER_CONSTANTS, USER_MASTER_MESSAGES } from '../../common/constants/user-master.constants';
import type { MemberRegistrationDto, SanitizedUser } from '../user-master/user-master.types';

@Injectable()
export class MembersService {
  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository
  ) {}

  /**
   * Generates a collision-safe unique referral code.
   */
  async getUniqueReferralCode(): Promise<string> {
    for (let i = 0; i < USER_MASTER_CONSTANTS.MAX_ID_GENERATION_RETRIES; i++) {
      const candidate = generateRandomReferralCode();
      const existing = await this.userRepository.checkReferralCodeExists(candidate);
      if (!existing) {
        return candidate;
      }
    }
    return `HZ${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  }

  /**
   * Registers a new Haatza Member.
   */
  async registerMember(dto: MemberRegistrationDto): Promise<{
    success: boolean;
    message: string;
    data: SanitizedUser;
  }> {
    // 1. Pre-check email or phone conflicts
    const existing = await this.userRepository.findByEmailOrPhone(dto.email, dto.phoneNumber);

    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException({
          success: false,
          message: USER_MASTER_MESSAGES.EMAIL_ALREADY_EXISTS,
          errors: [{ field: 'email', message: USER_MASTER_MESSAGES.EMAIL_ALREADY_EXISTS }],
        });
      }
      if (existing.phoneNumber === dto.phoneNumber) {
        throw new ConflictException({
          success: false,
          message: USER_MASTER_MESSAGES.PHONE_ALREADY_EXISTS,
          errors: [{ field: 'phoneNumber', message: USER_MASTER_MESSAGES.PHONE_ALREADY_EXISTS }],
        });
      }
    }

    // 2. Hash passcode with bcrypt (12 rounds)
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique referral code
    const referralCode = await this.getUniqueReferralCode();

    // 4. Create record in user_masters table through repository
    const newUser = await this.userRepository.createMember({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      referralCode,
      referredByCode: dto.referral || null,
      fcmToken: dto.fcmToken ?? null,
      status: dto.status ?? USER_MASTER_CONSTANTS.DEFAULT_STATUS,
    });

    return {
      success: true,
      message: USER_MASTER_MESSAGES.MEMBER_REGISTERED_SUCCESS,
      data: sanitizeUserResponse(newUser),
    };
  }
}
