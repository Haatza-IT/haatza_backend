import { Controller, Post, Req, Res, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { parseCookies, setRefreshTokenCookie, clearRefreshTokenCookie } from '../../common/utils/cookie.util';
import type { RefreshResponse, ClientAuditContext } from './auth.types';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
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
   * Refreshes member access token using the HttpOnly refresh token cookie.
   * Enforces 2-hour session lifetime and records device & location context.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponse> {
    const cookies = parseCookies(req.headers.cookie);
    const tokenFromCookie = cookies['refreshToken'];
    const tokenFromHeader = req.headers['x-refresh-token'];

    const rawRefreshToken = tokenFromCookie || (Array.isArray(tokenFromHeader) ? tokenFromHeader[0] : tokenFromHeader);
    const auditContext = this.extractAuditContext(req);

    const session = await this.authService.refreshSession(rawRefreshToken || '', auditContext);

    // Set new rotated refresh token in secure HttpOnly cookie (2-hour lifetime)
    setRefreshTokenCookie(res, session.refreshToken);

    // Provide access token in standard headers
    res.setHeader('x-access-token', session.accessToken);
    res.setHeader('Authorization', `Bearer ${session.accessToken}`);

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: session.accessToken,
        tokenType: 'Bearer',
        expiresIn: session.expiresIn,
        refreshTokenExpiresIn: session.refreshTokenExpiresIn,
      },
    };
  }

  /**
   * Revokes member refresh token and clears the authentication cookie (Logout).
   * Supports both POST /api/auth/revoke and POST /api/auth/logout.
   */
  @Post(['revoke', 'logout'])
  @HttpCode(HttpStatus.OK)
  async revokeToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean; message: string }> {
    const cookies = parseCookies(req.headers.cookie);
    const tokenFromCookie = cookies['refreshToken'];
    const tokenFromHeader = req.headers['x-refresh-token'];

    const rawRefreshToken = tokenFromCookie || (Array.isArray(tokenFromHeader) ? tokenFromHeader[0] : tokenFromHeader);
    const auditContext = this.extractAuditContext(req);

    if (rawRefreshToken) {
      await this.authService.revokeToken(rawRefreshToken, auditContext);
    }

    clearRefreshTokenCookie(res);

    return {
      success: true,
      message: 'Refresh token revoked successfully',
    };
  }
}

