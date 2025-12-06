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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import NotificationModal from "../../components/notification/NotificationModal";
import { useNotification } from "../../hooks";

interface ResetPasswordProps {
  navigation: any;
  route: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordProps> = ({
  navigation,
  route,
}) => {
  const { email, resetToken } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, resetPass } = useForgotPassword();
  const { visible, config, showNotification, hideNotification } = useNotification();

  const validatePassword = (): boolean => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all fields",
        confirmText: "OK",
      });
      return false;
    }

    if (newPassword.length < 6) {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Password must be at least 6 characters",
        confirmText: "OK",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Passwords do not match",
        confirmText: "OK",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    if (!resetToken) {
      showNotification({
        type: "error",
        title: "Session Expired",
        message: "Authentication session has expired. Please try again.",
        confirmText: "OK",
        onConfirm: () => {
          navigation.navigate("ForgotPassword");
        },
      });
      return;
    }

    const result = await resetPass(
      email,
      resetToken,
      newPassword,
      confirmPassword
    );
    if (result.success) {
      showNotification({
        type: "success",
        title: "Password Reset Successful",
        message: result.message || "Your password has been reset. Please login again.",
        confirmText: "Login Now",
        onConfirm: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      });
    } else {
      showNotification({
        type: "error",
        title: "Reset Failed",
        message: result.message || "Failed to reset password. Please try again.",
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
                      <Text style={styles.portalBadgeText}>RESET PASSWORD</Text>
                    </View>

                    <View style={styles.iconCircle}>
                      <Ionicons name="lock-closed-outline" size={24} color="#e0f2fe" />
                    </View>

                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                      Create a new password for{"\n"}
                      <Text style={styles.emailText}>{email}</Text>
                    </Text>
                  </View>

                  {/* Form */}
                  <View style={styles.formContainer}>
                    {/* New Password Input */}
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#38bdf8"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="rgba(226,232,240,0.65)"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color="#38bdf8"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#38bdf8"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="rgba(226,232,240,0.65)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color="#38bdf8"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                      style={[styles.resetButton, isLoading && styles.disabledButton]}
                      onPress={handleResetPassword}
                      disabled={isLoading}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={["#2563eb", "#38bdf8"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.resetButtonGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.resetButtonText}>Reset Password</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* Password Requirements */}
                  <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={newPassword.length >= 6 ? "#10B981" : "rgba(148,163,184,0.6)"}
                      />
                      <Text
                        style={[
                          styles.requirementText,
                          newPassword.length >= 6 && styles.requirementMet,
                        ]}
                      >
                        At least 6 characters
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={
                          newPassword &&
                          confirmPassword &&
                          newPassword === confirmPassword
                            ? "#10B981"
                            : "rgba(148,163,184,0.6)"
                        }
                      />
                      <Text
                        style={[
                          styles.requirementText,
                          newPassword &&
                            confirmPassword &&
                            newPassword === confirmPassword &&
                            styles.requirementMet,
                        ]}
                      >
                        Passwords match
                      </Text>
                    </View>
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
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
  },
  resetButton: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginTop: 8,
  },
  resetButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  requirementsContainer: {
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(226,232,240,0.9)",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: "rgba(148,163,184,0.8)",
  },
  requirementMet: {
    color: "#10B981",
    fontWeight: "500",
  },
});
