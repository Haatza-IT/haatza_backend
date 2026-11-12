import { Injectable, ConflictException, Inject } from '@nestjs/common';
import crypto from 'crypto';
import { UserMasterRepository } from '../../database/user-master.repository';
import { hashPassword } from '../../common/utils/password.util';
import type { MemberRegistrationDto, MemberResponse, SanitizedMember } from './members.types';
import { MEMBER_MESSAGES } from './members.types';

@Injectable()
export class MembersService {
  private readonly MAX_RETRIES = 10;

  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository,
  ) {}

  /**
   * Generates a unique referral code starting with 'HZ'.
   * Owned exclusively by Members business logic.
   */
  async generateUniqueReferralCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      let code = 'HZ';
      const bytes = crypto.randomBytes(6);
      for (let i = 0; i < 6; i++) {
        code += chars[bytes[i] % chars.length];
      }
      const exists = await this.userRepository.checkReferralCodeExists(code);
      if (!exists) {
        return code;
      }
    }
    return `HZ${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  }

  /**
   * Sanitizes member data for API responses (stripping password).
   */
  private sanitizeMember(user: any): SanitizedMember {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeData } = user;
    return safeData as SanitizedMember;
  }

  /**
   * Registers a new Haatza Member.
   */
  async registerMember(dto: MemberRegistrationDto): Promise<MemberResponse> {
    // 1. Conflict detection for email or phone
    const existing = await this.userRepository.findByEmailOrPhone(dto.email, dto.phoneNumber);
    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException({
          success: false,
          message: MEMBER_MESSAGES.EMAIL_ALREADY_EXISTS,
          errors: [{ field: 'email', message: MEMBER_MESSAGES.EMAIL_ALREADY_EXISTS }],
        });
      }
      if (existing.phoneNumber === dto.phoneNumber) {
        throw new ConflictException({
          success: false,
          message: MEMBER_MESSAGES.PHONE_ALREADY_EXISTS,
          errors: [{ field: 'phoneNumber', message: MEMBER_MESSAGES.PHONE_ALREADY_EXISTS }],
        });
      }
    }

    // 2. Hash passcode with bcrypt (12 rounds)
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique referral code
    const referralCode = await this.generateUniqueReferralCode();

    // 4. Persist to database
    const createdUser = await this.userRepository.createMember({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      referralCode,
      referredByCode: dto.referral && dto.referral.trim().length > 0 ? dto.referral.trim() : null,
      fcmToken: dto.fcmToken ?? null,
      status: dto.status ?? true,
    });

    // 5. Return sanitized response
    return {
      success: true,
      message: MEMBER_MESSAGES.REGISTERED_SUCCESS,
      data: this.sanitizeMember(createdUser),
    };
  }
}
