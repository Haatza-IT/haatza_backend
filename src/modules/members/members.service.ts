import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import type { Response } from 'express';
import { UserMasterRepository } from '../../database/user-master.repository';
import { hashPassword } from '../../common/utils/password.util';
import { AuthService } from '../auth/auth.service';
import { setRefreshTokenCookie } from '../../common/utils/cookie.util';
import type { MemberRegistrationDto, MemberResponse } from './members.types';
import { MEMBER_MESSAGES, serializeRegisteredMember } from './members.types';

@Injectable()
export class MembersService {
  private readonly MAX_RETRIES = 10;

  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository,
    @Inject(AuthService)
    private readonly authService: AuthService,
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
   * Registers a new Haatza Member, issues JWT access token and refresh token session,
   * sets the secure HttpOnly refresh token cookie, and returns the exact 6-field public data object.
   */
  async registerMember(dto: MemberRegistrationDto, res?: Response): Promise<MemberResponse> {
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

    // Determine referral code provided
    const rawReferral = dto.referral || dto.referralCode;
    const referredByCode = rawReferral && rawReferral.trim().length > 0 ? rawReferral.trim() : null;

    // 4. Persist to database (Audit fields createdBy/updatedBy default to null for public self-registration)
    const createdUser = await this.userRepository.createMember({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      referralCode,
      referredByCode,
      fcmToken: dto.fcmToken ?? null,
      status: dto.status ?? true,
      createdBy: null,
      updatedBy: null,
    });

    // 5. Generate Access Token & Refresh Token session
    const session = await this.authService.createSession(createdUser.userId, createdUser.email);

    // 6. Deliver tokens securely:
    // - Refresh token delivered via HttpOnly, Secure, SameSite cookie
    // - Access token delivered via standard response headers
    if (res) {
      setRefreshTokenCookie(res, session.refreshToken);
      res.setHeader('x-access-token', session.accessToken);
      res.setHeader('Authorization', `Bearer ${session.accessToken}`);
    }

    // 7. Return exact 6-field registration response (clean data object, no sensitive or null fields)
    return {
      success: true,
      message: MEMBER_MESSAGES.REGISTERED_SUCCESS,
      data: serializeRegisteredMember(createdUser),
    };
  }
}
