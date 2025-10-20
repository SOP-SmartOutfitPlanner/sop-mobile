// ==================== Request Types ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResendOtpRequest {
  email: string;
}
export interface LoginGoogleRequest {
  idToken: string;
}
export interface forgotPasswordRequest {
  email: string;
}
export interface verifyOtpResetRequest {
  email: string;
  otp: string;
}
export interface resetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

// ==================== Response Types ====================

export interface RegisterResponse {
  statusCode: number;
  message: string;
  data: {
    email: string;
    message: string;
  };
}

export interface VerifyOtpResponse {
  statusCode: number;
  message: string;
  data: null;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ResendOtpResponse {
  statusCode: number;
  message: string;
  data: null;
}

export interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutResponse {
  statusCode: number;
  message: string;
  data: null;
}
export interface forgotPasswordResponse {
  statusCode: number;
  message: string;
  data: null;
}
export interface verifyOtpResetResponse {
  statusCode: number;
  message: string;
  data: {
    resetToken: string;
    expiryMinutes: number;
  };
}
export interface resetPasswordResponse {
  statusCode: number;
  message: string;
  data: null;
}
// ==================== Error Types ====================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ==================== Legacy Aliases (for backward compatibility) ====================

export type VerifyRequest = VerifyOtpRequest;
export type ResendOTPRequest = ResendOtpRequest;