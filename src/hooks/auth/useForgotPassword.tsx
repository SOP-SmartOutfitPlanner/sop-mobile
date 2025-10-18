import { useState } from "react";
import { Alert } from "react-native";
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
  const sendOtp = async (emailAddress: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data: forgotPasswordRequest = {
        email: emailAddress,
      };

      const response = await forgotPassword(data);

      if (response.statusCode === 200) {
        setEmail(emailAddress);
        Alert.alert("Success", "OTP code has been sent to your email");
        return true;
      }
      return false;
    } catch (error: any) {
      let errorMessage = "Failed to send OTP";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and get reset token
  // Returns resetToken string on success, or null on failure
  const verifyOtp = async (
    emailAddress: string,
    otp: string
  ): Promise<string | null> => {
    if (!emailAddress) {
      Alert.alert("Error", "Email is not defined");
      return null;
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
        Alert.alert(
          "Success",
          `OTP is valid. Please reset your password within ${response.data.expiryMinutes} minutes`
        );
        return token;
      }
      return null;
    } catch (error: any) {
      let errorMessage = "OTP verification failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password with new password
  const resetPass = async (
    emailAddress: string,
    resetTokenParam: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    if (!emailAddress || !resetTokenParam) {
      Alert.alert("Error", "Invalid authentication information");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
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
        Alert.alert("Success", "Password has been reset successfully");
        // Reset state
        setEmail("");
        setResetToken("");
        setExpiryMinutes(0);
        return true;
      }
      return false;
    } catch (error: any) {
      let errorMessage = "Password reset failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
      return false;
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
