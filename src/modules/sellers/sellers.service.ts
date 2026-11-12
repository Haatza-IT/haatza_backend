import { Injectable, ConflictException, Inject } from '@nestjs/common';
import crypto from 'crypto';
import { UserMasterRepository } from '../../database/user-master.repository';
import { hashPassword } from '../../common/utils/password.util';
import {
  generateRandomReferralCode,
  generateRandomSellerId,
} from '../../common/utils/code-generator.util';
import { sanitizeUserResponse } from '../../common/utils/sanitizer.util';
import {
  USER_MASTER_CONSTANTS,
  USER_MASTER_MESSAGES,
} from '../../common/constants/user-master.constants';
import type {
  SellerRegistrationDto,
  SanitizedUser,
} from '../user-master/user-master.types';

@Injectable()
export class SellersService {
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
   * Generates a collision-safe unique seller ID.
   */
  async getUniqueSellerId(): Promise<string> {
    for (let i = 0; i < USER_MASTER_CONSTANTS.MAX_ID_GENERATION_RETRIES; i++) {
      const candidate = generateRandomSellerId();
      const existing = await this.userRepository.checkSellerIdExists(candidate);
      if (!existing) {
        return candidate;
      }
    }
    return `HSL-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Registers a Haatza Seller with full profile, tax, and banking details.
   */
  async registerSeller(dto: SellerRegistrationDto): Promise<{
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

    // 2. Hash password with bcrypt (12 rounds)
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique sellerId and referralCode in parallel
    const [sellerId, referralCode] = await Promise.all([
      this.getUniqueSellerId(),
      this.getUniqueReferralCode(),
    ]);

    // 4. Create record in user_masters table through repository
    const newSeller = await this.userRepository.createSeller({
      ...dto,
      password: hashedPassword,
      sellerId,
      referralCode,
      referredByCode: dto.referral || null,
    });

    return {
      success: true,
      message: USER_MASTER_MESSAGES.SELLER_REGISTERED_SUCCESS,
      data: sanitizeUserResponse(newSeller),
    };
  }
}
