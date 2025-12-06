import React, { useState, useRef, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { resendOtp, verifyOtp } from "../../services/endpoint";
import NotificationModal from "../../components/notification/NotificationModal";
import { useNotification } from "../../hooks";
import AnimatedBackground from "../../components/common/AnimatedBackground";

type VerifyScreenProps = StackScreenProps<RootStackParamList, "Verify">;

export const VerifyScreen: React.FC<VerifyScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { visible, config, showNotification, hideNotification } =
    useNotification();

  // Refs for OTP inputs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
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

    setIsLoading(true);

    try {
      const response = await verifyOtp({
        email: email,
        otp: otpCode,
      });

      if (response.statusCode === 200) {
        showNotification({
          type: "success",
          title: "Verification Successful! 🎉",
          message: "You can now login to your account.",
          confirmText: "Login Now",
          onConfirm: () => {
            navigation.navigate("Auth");
          },
        });
      }
    } catch (error: any) {
      showNotification({
        type: "error",
        title: "Verification Failed",
        message: error?.message || "Invalid OTP code. Please try again.",
        confirmText: "Try Again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const response = await resendOtp({
        email: email,
      });

      if (response.statusCode === 200) {
        showNotification({
          type: "success",
          title: "OTP Sent",
          message: "A new OTP code has been sent to your email",
          confirmText: "OK",
        });
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error: any) {
      showNotification({
        type: "error",
        title: "Failed to Resend",
        message: error?.message || "Could not resend OTP. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    showNotification({
      type: "warning",
      title: "Confirm",
      message:
        "Are you sure you want to go back? You'll need to register again.",
      showCancel: true,
      confirmText: "Go Back",
      cancelText: "Stay",
      onConfirm: () => {
        navigation.goBack();
      },
    });
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
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                      <Ionicons name="arrow-back" size={22} color="#e2e8f0" />
                    </TouchableOpacity>

                    <View style={styles.portalBadge}>
                      <Text style={styles.portalBadgeText}>VERIFY EMAIL</Text>
                    </View>

                    <View style={styles.iconCircle}>
                      <Ionicons name="mail-outline" size={24} color="#e0f2fe" />
                    </View>

                    <Text style={styles.title}>Verify Email</Text>
                    <Text style={styles.subtitle}>
                      We have sent a verification code consisting of 6 digits to email
                    </Text>
                    <Text style={styles.email}>{email}</Text>
                  </View>

                  {/* OTP Input */}
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpRefs.current[index] = ref;
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
                    style={[
                      styles.verifyButton,
                      (isLoading || otp.join("").length !== 6) && styles.disabledButton,
                    ]}
                    onPress={handleVerify}
                    disabled={isLoading || otp.join("").length !== 6}
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
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    {canResend ? (
                      <TouchableOpacity
                        onPress={handleResendOtp}
                        disabled={isResending}
                      >
                        {isResending ? (
                          <ActivityIndicator size="small" color="#38bdf8" />
                        ) : (
                          <Text style={styles.resendLink}>Resend</Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.countdown}>Resend after {countdown}s</Text>
                    )}
                  </View>

                  {/* Help Text */}
                  <View style={styles.helpContainer}>
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color="#facc15"
                    />
                    <Text style={styles.helpText}>
                      Check your spam folder if you don't see the email
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
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
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
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.5)",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#e5e7eb",
    backgroundColor: "rgba(15,23,42,0.9)",
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
    opacity: 0.5,
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
  countdown: {
    fontSize: 14,
    color: "rgba(148,163,184,0.7)",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(24,20,10,0.4)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.5)",
  },
  helpText: {
    fontSize: 12,
    color: "rgba(252,211,77,0.95)",
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});
