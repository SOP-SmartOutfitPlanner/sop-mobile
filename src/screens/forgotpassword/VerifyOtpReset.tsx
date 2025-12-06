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
import { LinearGradient } from "expo-linear-gradient";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import NotificationModal from "../../components/notification/NotificationModal";
import { useNotification } from "../../hooks";

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
  const { visible, config, showNotification, hideNotification } = useNotification();

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
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter all 6 digits of the OTP code",
        confirmText: "OK",
      });
      return;
    }

    const result = await verifyOtp(email, otpCode);
    if (result.success && result.token) {
      showNotification({
        type: "success",
        title: "OTP Verified",
        message: result.message || "OTP is valid. Redirecting to reset password...",
        confirmText: "Continue",
        onConfirm: () => {
          navigation.navigate("ResetPassword", { email, resetToken: result.token });
        },
      });
    } else {
      showNotification({
        type: "error",
        title: "Verification Failed",
        message: result.message || "Invalid OTP code. Please try again.",
        confirmText: "OK",
      });
    }
  };

  const handleResendOtp = async () => {
    if (email) {
      const result = await sendOtp(email);
      if (result.success) {
        showNotification({
          type: "success",
          title: "OTP Sent",
          message: result.message || "A new OTP code has been sent to your email",
          confirmText: "OK",
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        showNotification({
          type: "error",
          title: "Failed to Resend",
          message: result.message || "Could not resend OTP. Please try again.",
          confirmText: "OK",
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardContainer}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.cardWrapper}>
                <View style={styles.card}>
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Ionicons name="arrow-back" size={22} color="#e2e8f0" />
                    </TouchableOpacity>

                    <View style={styles.portalBadge}>
                      <Text style={styles.portalBadgeText}>VERIFY OTP</Text>
                    </View>

                    <View style={styles.iconCircle}>
                      <Ionicons name="shield-checkmark-outline" size={24} color="#e0f2fe" />
                    </View>

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
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={["#2563eb", "#38bdf8"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.verifyButtonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.verifyButtonText}>Verify</Text>
                      )}
                    </LinearGradient>
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
                    <Ionicons name="time-outline" size={18} color="#facc15" />
                    <Text style={styles.infoText}>
                      OTP code will expire in 15 minutes
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AnimatedBackground>

      {/* Notification Modal */}
      <NotificationModal
        isVisible={visible}
        type={config.type}
        title={config.title}
        message={config.message}
        onClose={hideNotification}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        onConfirm={config.onConfirm}
        showCancel={config.showCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    backgroundColor: "rgba(15,23,42,0.8)",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 12,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  portalBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.45)",
    backgroundColor: "rgba(15,23,42,0.9)",
    marginBottom: 18,
  },
  portalBadgeText: {
    fontSize: 11,
    letterSpacing: 2,
    color: "rgba(226,232,240,0.9)",
    fontWeight: "600",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(59,130,246,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.6)",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5f2ff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.82)",
    lineHeight: 20,
    textAlign: "center",
  },
  emailText: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.5)",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#e5e7eb",
  },
  otpInputFilled: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56,189,248,0.15)",
  },
  verifyButton: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 20,
  },
  verifyButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "rgba(226,232,240,0.7)",
  },
  resendLink: {
    fontSize: 14,
    color: "#38bdf8",
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.5)",
    backgroundColor: "rgba(24,20,10,0.4)",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: "rgba(252,211,77,0.95)",
    lineHeight: 18,
  },
});
