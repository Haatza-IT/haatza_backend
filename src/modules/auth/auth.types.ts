export interface ClientAuditContext {
  ip?: string;
  userAgent?: string;
  location?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
}

export interface RefreshResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data?: RefreshResponseData;
  errors?: unknown[];
}

