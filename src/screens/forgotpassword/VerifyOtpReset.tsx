import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

interface VerifyOtpResetProps {
  navigation: any;
  route: any;
}

export const VerifyOtpResetScreen: React.FC<VerifyOtpResetProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { isLoading, verifyOtp, sendOtp, resetToken } = useForgotPassword();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const otpArray = value.slice(0, 6).split("");
      const newOtp = [...otp];
      otpArray.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus on last filled input or next empty
      const nextIndex = Math.min(index + otpArray.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return;
    }

    // verifyOtp now returns the resetToken string on success
    const token = await verifyOtp(email, otpCode);
    if (token) {
      // pass the token explicitly to the next screen to avoid lost state
      navigation.navigate("ResetPassword", { email, resetToken: token });
    }
  };

  const handleResendOtp = async () => {
    if (email) {
      await sendOtp(email);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit OTP code sent to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.disabledButton]}
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Ionicons name="time-outline" size={20} color="#F59E0B" />
            <Text style={styles.infoText}>
              OTP code will expire in 15 minutes
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContainer: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
  },
  emailText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#1E293B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  verifyButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: "#64748B",
  },
  resendLink: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
});
