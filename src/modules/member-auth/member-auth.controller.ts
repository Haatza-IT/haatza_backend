import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { MemberAuthService } from './member-auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  checkUserQuerySchema,
  loginEmailSchema,
  loginPhoneNumberSchema,
  generateOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type CheckUserQueryDto,
  type LoginEmailDto,
  type LoginPhoneNumberDto,
  type GenerateOtpDto,
  type VerifyOtpDto,
  type ResendOtpDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
} from './member-auth.schema';
import type {
  CheckUserResponse,
  LoginResponse,
  OtpSendResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from './member-auth.types';
import type { ClientAuditContext } from '../auth/auth.types';

@Controller(['api/login_Haatza_Members', 'login_Haatza_Members'])
export class MemberAuthController {
  constructor(
    @Inject(MemberAuthService)
    private readonly memberAuthService: MemberAuthService,
  ) {}

  /**
   * Extracts location and device context from request headers for security auditing.
   */
  private extractAuditContext(req: Request): ClientAuditContext {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : Array.isArray(forwarded)
          ? forwarded[0]
          : req.ip) || 'unknown';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const location =
      (req.headers['x-client-location'] as string) ||
      (req.headers['cf-ipcountry'] as string) ||
      (req.headers['x-app-location'] as string) ||
      undefined;
    return { ip, userAgent, location };
  }

  /**
   * 1. GET /check_user
   * Checks whether a user exists in the database by phoneNumber or email.
   */
  @Get('check_user')
  @HttpCode(HttpStatus.OK)
  async checkUser(
    @Query(new ZodValidationPipe(checkUserQuerySchema)) query: CheckUserQueryDto,
  ): Promise<CheckUserResponse> {
    return this.memberAuthService.checkUser(query);
  }

  /**
   * 2. POST /login_email
   * Authenticates member with email and password, issuing 15-minute JWT and 2-hour refresh token.
   */
  @Post('login_email')
  @HttpCode(HttpStatus.OK)
  async loginEmail(
    @Body(new ZodValidationPipe(loginEmailSchema)) dto: LoginEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const auditContext = this.extractAuditContext(req);
    return this.memberAuthService.loginEmail(dto, auditContext, res);
  }

  /**
   * 3. POST /login_phonenumber
   * Validates phone number, checks registered user, generates & dispatches OTP via Fast2SMS.
   */
  @Post('login_phonenumber')
  @HttpCode(HttpStatus.OK)
  async loginPhoneNumber(
    @Body(new ZodValidationPipe(loginPhoneNumberSchema)) dto: LoginPhoneNumberDto,
  ): Promise<OtpSendResponse> {
    return this.memberAuthService.loginPhoneNumber(dto);
  }

  /**
   * 4. POST /generate_otp
   * Generates and dispatches 6-digit OTP code to phone number for specified purpose.
   */
  @Post('generate_otp')
  @HttpCode(HttpStatus.OK)
  async generateOtp(
    @Body(new ZodValidationPipe(generateOtpSchema)) dto: GenerateOtpDto,
  ): Promise<OtpSendResponse> {
    return this.memberAuthService.generateOtp(dto);
  }

  /**
   * 5. POST /verify_otp
   * Verifies submitted OTP code. If purpose is 'login', creates authenticated session & returns user details.
   */
  @Post('verify_otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body(new ZodValidationPipe(verifyOtpSchema)) dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyOtpResponse> {
    const auditContext = this.extractAuditContext(req);
    return this.memberAuthService.verifyOtp(dto, auditContext, res);
  }

  /**
   * 6. POST /resend_otp
   * Resends existing active OTP or generates fresh code respecting 30s cooldown.
   */
  @Post('resend_otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(
    @Body(new ZodValidationPipe(resendOtpSchema)) dto: ResendOtpDto,
  ): Promise<OtpSendResponse> {
    return this.memberAuthService.resendOtp(dto);
  }

  /**
   * 7. POST /forgot_password
   * Sends password recovery OTP to registered phone number.
   */
  @Post('forgot_password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema)) dto: ForgotPasswordDto,
  ): Promise<OtpSendResponse> {
    return this.memberAuthService.forgotPassword(dto);
  }

  /**
   * 8. POST /reset_password
   * Verifies OTP, updates password with bcrypt 12 rounds, and revokes all active sessions.
   */
  @Post('reset_password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.memberAuthService.resetPassword(dto);
  }
}

