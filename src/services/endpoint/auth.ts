import apiClient from "../api/apiClient";
import {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
} from "../../types/auth";

/**
 * Auth API Endpoints
 * Base URL: https://sop.wizlab.io.vn/api/v1/auth
 */

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/api/v1/auth/register",
    data
  );
  return response.data;
};

/**
 * Verify OTP after registration
 * POST /api/v1/auth/otp/verify
 */
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    "/api/v1/auth/otp/verify",
    data
  );
  return response.data;
};

/**
 * Login with email and password
 * POST /api/v1/auth
 * Returns access token and refresh token
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth", data);
  return response.data;
};

/**
 * Resend OTP to email
 * POST /api/v1/auth/otp/resend
 */
export const resendOtp = async (
  data: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await apiClient.post<ResendOtpResponse>(
    "/api/v1/auth/otp/resend",
    data
  );
  return response.data;
};

/**
 * Refresh access token using refresh token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/api/v1/auth/refresh-token",
    data
  );
  return response.data;
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 * Requires authentication (Bearer token in header)
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/api/v1/auth/logout");
  return response.data;
};

/**
 * Auth API Service Object
 * Use this for cleaner imports
 */
export const authApi = {
  register,
  verifyOtp,
  login,
  resendOtp,
  refreshToken,
  logout,
};

export default authApi;
