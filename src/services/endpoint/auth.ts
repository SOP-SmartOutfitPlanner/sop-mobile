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
 * Base URL: https://sop.wizlab.io.vn/auth
 */

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    data
  );
  return response.data;
};

/**
 * Verify OTP after registration
 * POST /auth/otp/verify
 */
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    "/auth/otp/verify",
    data
  );
  return response.data;
};

/**
 * Login with email and password
 * POST /auth
 * Returns access token and refresh token
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth", data);
  return response.data;
};

/**
 * Resend OTP to email
 * POST /auth/otp/resend
 */
export const resendOtp = async (
  data: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await apiClient.post<ResendOtpResponse>(
    "/auth/otp/resend",
    data
  );
  return response.data;
};

/**
 * Refresh access token using refresh token
 * POST /auth/refresh-token
 */
export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh-token",
    data
  );
  return response.data;
};

/**
 * Logout user
 * POST /auth/logout
 * Requires authentication (Bearer token in header)
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
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
