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
}

export interface RefreshResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data?: RefreshResponseData;
  errors?: unknown[];
}

