import React, { useState } from "react";
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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import NotificationModal from "../../components/notification/NotificationModal";
import { useNotification } from "../../hooks";

const { height } = Dimensions.get("window");

interface ForgotPasswordProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const { isLoading, sendOtp } = useForgotPassword();
  const { visible, config, showNotification, hideNotification } = useNotification();

  const handleSendOtp = async () => {
    // Validation
    if (!email.trim()) {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter your email address",
        confirmText: "OK",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter a valid email address",
        confirmText: "OK",
      });
      return;
    }

    const result = await sendOtp(email);
    if (result.success) {
      showNotification({
        type: "success",
        title: "OTP Sent",
        message: result.message || "OTP code has been sent to your email",
        confirmText: "Continue",
        onConfirm: () => {
          navigation.navigate("VerifyOtpReset", { email });
        },
      });
    } else {
      showNotification({
        type: "error",
        title: "Failed to Send OTP",
        message: result.message || "Failed to send OTP. Please try again.",
        confirmText: "OK",
      });
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
                      <Text style={styles.portalBadgeText}>SECURE PORTAL</Text>
                    </View>

                    <View style={styles.iconCircle}>
                      <Ionicons name="mail-outline" size={24} color="#e0f2fe" />
                    </View>

                    <Text style={styles.title}>Forgot password?</Text>
                    <Text style={styles.subtitle}>
                      Enter your email to receive OTP for password reset
                    </Text>
                  </View>

                  {/* Form */}
                  <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#38bdf8"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="rgba(226,232,240,0.65)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        editable={!isLoading}
                      />
                    </View>

                    <TouchableOpacity
                      style={[styles.sendButton, isLoading && styles.disabledButton]}
                      onPress={handleSendOtp}
                      disabled={isLoading}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={["#2563eb", "#38bdf8"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.sendButtonGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.sendButtonText}>Send OTP</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* Info */}
                  <View style={styles.infoContainer}>
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color="#facc15"
                    />
                    <Text style={styles.infoText}>
                      Note: OTP will be valid for 15 minutes
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
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.75)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#e5e7eb",
    padding: 0,
  },
  sendButton: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  sendButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
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
  circle1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(59,130,246,0.22)",
    top: -80,
    right: -60,
  },
  circle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(6,182,212,0.16)",
    bottom: -50,
    left: -40,
  },
  circle3: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(129,140,248,0.14)",
    top: height * 0.35,
    right: 10,
  },
});
