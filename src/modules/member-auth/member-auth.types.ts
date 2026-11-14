export interface CustomerSummary {
  nickname: string;
  status: boolean;
  email: string;
  phoneNumber: string;
  referralCode: string;
}

export interface CheckUserData {
  exists: boolean;
  isRegistered: boolean;
  nickname?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  referralCode?: string;
  status?: boolean;
}

export interface CheckUserResponse {
  success: boolean;
  message: string;
  data: CheckUserData;
}

export interface LoginUserData {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  status: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: LoginUserData;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshTokenExpiresIn?: number;
  };
}

export interface OtpSendResponse {
  success: boolean;
  message: string;
  data?: {
    phoneNumber: string;
    expiresInSeconds: number;
  };
  error?: unknown;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    customer?: CustomerSummary;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

