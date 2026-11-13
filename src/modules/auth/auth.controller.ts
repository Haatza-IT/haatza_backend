import { Controller, Post, Req, Res, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { parseCookies, setRefreshTokenCookie, clearRefreshTokenCookie } from '../../common/utils/cookie.util';
import type { RefreshResponse } from './auth.types';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  /**
   * Refreshes member access token using the HttpOnly refresh token cookie.
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

    const session = await this.authService.refreshSession(rawRefreshToken || '');

    // Set new rotated refresh token in secure HttpOnly cookie
    setRefreshTokenCookie(res, session.refreshToken);

    // Provide access token in standard header
    res.setHeader('x-access-token', session.accessToken);
    res.setHeader('Authorization', `Bearer ${session.accessToken}`);

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: session.accessToken,
        tokenType: 'Bearer',
        expiresIn: session.expiresIn,
      },
    };
  }

  /**
   * Revokes member refresh token and clears the authentication cookie.
   */
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  async revokeToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean; message: string }> {
    const cookies = parseCookies(req.headers.cookie);
    const tokenFromCookie = cookies['refreshToken'];
    const tokenFromHeader = req.headers['x-refresh-token'];

    const rawRefreshToken = tokenFromCookie || (Array.isArray(tokenFromHeader) ? tokenFromHeader[0] : tokenFromHeader);

    if (rawRefreshToken) {
      await this.authService.revokeToken(rawRefreshToken);
    }

    clearRefreshTokenCookie(res);

    return {
      success: true,
      message: 'Refresh token revoked successfully',
    };
  }
}

