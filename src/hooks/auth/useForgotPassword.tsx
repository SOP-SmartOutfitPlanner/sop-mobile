import { useState } from "react";
import {
  forgotPassword,
  verifyOtpReset,
  resetPassword,
} from "../../services/endpoint/auth";
import {
  forgotPasswordRequest,
  verifyOtpResetRequest,
  resetPasswordRequest,
} from "../../types/auth";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(0);

  // Step 1: Send OTP to email
  // Returns { success: boolean, message?: string }
  const sendOtp = async (emailAddress: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const data: forgotPasswordRequest = {
        email: emailAddress,
      };

      const response = await forgotPassword(data);

      if (response.statusCode === 200) {
        setEmail(emailAddress);
        return { success: true, message: "OTP code has been sent to your email" };
      }
      return { success: false, message: "Failed to send OTP" };
    } catch (error: any) {
      let errorMessage = "Failed to send OTP";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and get reset token
  // Returns { success: boolean, token?: string, message?: string, expiryMinutes?: number }
  const verifyOtp = async (
    emailAddress: string,
    otp: string
  ): Promise<{ success: boolean; token?: string; message?: string; expiryMinutes?: number }> => {
    if (!emailAddress) {
      return { success: false, message: "Email is not defined" };
    }

    setIsLoading(true);
    try {
      const data: verifyOtpResetRequest = {
        email: emailAddress,
        otp,
      };

      const response = await verifyOtpReset(data);

      if (response.statusCode === 200) {
        const token = response.data.resetToken;
        setEmail(emailAddress);
        setResetToken(token);
        setExpiryMinutes(response.data.expiryMinutes);
        return {
          success: true,
          token,
          message: `OTP is valid. Please reset your password within ${response.data.expiryMinutes} minutes`,
          expiryMinutes: response.data.expiryMinutes,
        };
      }
      return { success: false, message: "OTP verification failed" };
    } catch (error: any) {
      let errorMessage = "OTP verification failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password with new password
  // Returns { success: boolean, message?: string }
  const resetPass = async (
    emailAddress: string,
    resetTokenParam: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!emailAddress || !resetTokenParam) {
      return { success: false, message: "Invalid authentication information" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    setIsLoading(true);
    try {
      const data: resetPasswordRequest = {
        email: emailAddress,
        resetToken: resetTokenParam,
        newPassword,
        confirmPassword,
      };

      const response = await resetPassword(data);

      if (response.statusCode === 200) {
        // Reset state
        setEmail("");
        setResetToken("");
        setExpiryMinutes(0);
        return { success: true, message: "Password has been reset successfully" };
      }
      return { success: false, message: "Password reset failed" };
    } catch (error: any) {
      let errorMessage = "Password reset failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all state
  const resetState = () => {
    setEmail("");
    setResetToken("");
    setExpiryMinutes(0);
  };

  return {
    isLoading,
    email,
    resetToken,
    expiryMinutes,
    sendOtp,
    verifyOtp,
    resetPass,
    resetState,
  };
};
