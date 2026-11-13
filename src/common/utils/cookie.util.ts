import type { Response } from 'express';

/**
 * Parses HTTP cookie header into key-value pairs.
 * Safely handles malformed cookie encoding without crashing the request.
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        // Fallback safely to raw unescaped value if malformed
        cookies[key] = val;
      }
    }
  }
  return cookies;
}

/**
 * Resolves SameSite and Secure settings for refresh-token cookies.
 *
 * For cross-site frontend applications (e.g. frontend on vercel.app/haatza.com and
 * backend on onrender.com), browsers require sameSite: 'none' and secure: true.
 * In local development without HTTPS, sameSite: 'lax' and secure: false is used.
 */
function resolveCookieOptions(): { sameSite: 'strict' | 'lax' | 'none'; secure: boolean } {
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredSameSite = process.env.COOKIE_SAME_SITE?.toLowerCase();

  const sameSite: 'strict' | 'lax' | 'none' =
    configuredSameSite === 'strict' || configuredSameSite === 'lax' || configuredSameSite === 'none'
      ? configuredSameSite
      : isProduction
        ? 'none'
        : 'lax';

  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === 'true'
      : sameSite === 'none' || isProduction;

  return { sameSite, secure };
}

/**
 * Sets HttpOnly, Secure, SameSite refresh token cookie.
 */
export function setRefreshTokenCookie(res: Response, token: string): void {
  const { sameSite, secure } = resolveCookieOptions();

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
}

/**
 * Clears the refresh token cookie upon logout or revocation.
 */
export function clearRefreshTokenCookie(res: Response): void {
  const { sameSite, secure } = resolveCookieOptions();

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
  });
}
