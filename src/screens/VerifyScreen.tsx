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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { verifyOtp, resendOtp } from "../services/endpoint";

interface VerifyScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
    };
  };
}

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
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số mã OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp({
        email: email,
        otp: otpCode,
      });

      if (response.statusCode === 200) {
        Alert.alert(
          "Thành công! 🎉",
          "Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.",
          [
            {
              text: "Đăng nhập",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ]
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Xác thực thất bại";
      Alert.alert("Lỗi", errorMessage);
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
        Alert.alert("Thành công", "Mã OTP mới đã được gửi đến email của bạn");
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gửi lại mã OTP thất bại";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn quay lại? Bạn sẽ cần đăng ký lại.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Quay lại",
          onPress: () => navigation.goBack(),
          style: "destructive",
        },
      ]
    );
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={48} color="#3B82F6" />
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Xác thực Email</Text>
            <Text style={styles.subtitle}>
              Chúng tôi đã gửi mã xác thực gồm 6 số đến
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
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Xác thực</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Không nhận được mã? </Text>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <Text style={styles.resendLink}>Gửi lại</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdown}>Gửi lại sau {countdown}s</Text>
            )}
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#64748B"
            />
            <Text style={styles.helpText}>
              Kiểm tra cả thư mục spam nếu không thấy email
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
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
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
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
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
    opacity: 0.5,
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
  countdown: {
    fontSize: 14,
    color: "#94A3B8",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 12,
  },
  helpText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
    flex: 1,
  },
});
