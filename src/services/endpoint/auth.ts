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
  LoginGoogleRequest,
  forgotPasswordRequest,
  forgotPasswordResponse,
  verifyOtpResetRequest,
  verifyOtpResetResponse,
  resetPasswordRequest,
  resetPasswordResponse,
} from "../../types/auth";

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    data
  );
  return response.data;
};


export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>(
    "/auth/otp/verify",
    data
  );
  return response.data;
};


export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth", data);
  return response.data;
};


export const resendOtp = async (
  data: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await apiClient.post<ResendOtpResponse>(
    "/auth/otp/resend",
    data
  );
  return response.data;
};


export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh-token",
    data
  );
  return response.data;
};


export const logoutAPI = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
};

export const LoginGoogle = async (idToken: String) => {
  const response = await apiClient.post<LoginResponse>("/auth/login/google/oauth", idToken );
  return response.data;
};

export const forgotPassword = async (data: forgotPasswordRequest): Promise<forgotPasswordResponse> => {
  const response = await apiClient.post<forgotPasswordResponse>("/auth/password/forgot", data);
  return response.data;
};
export const verifyOtpReset = async (data: verifyOtpResetRequest): Promise<verifyOtpResetResponse> => {
  const response = await apiClient.post<verifyOtpResetResponse>("/auth/password/verify-otp", data);
  return response.data;
}
export const resetPassword = async (data:resetPasswordRequest) : Promise<resetPasswordResponse> => {
  const response = await apiClient.post<resetPasswordResponse>("/auth/password/reset", data);
  return response.data;
};
export const authApi = {
  register,
  verifyOtp,
  loginAPI,
  resendOtp,
  refreshToken,
  logoutAPI,
};

export default authApi;
