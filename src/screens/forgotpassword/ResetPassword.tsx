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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

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

  const validatePassword = (): boolean => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    if (!resetToken) {
      Alert.alert(
        "Error",
        "Authentication session has expired. Please try again."
      );
      navigation.navigate("ForgotPassword");
      return;
    }

    const success = await resetPass(
      email,
      resetToken,
      newPassword,
      confirmPassword
    );
    if (success) {
      // Navigate back to login
      Alert.alert("Success", "Password has been reset. Please login again.", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]);
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
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={48} color="#3B82F6" />
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
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#94A3B8"
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
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#94A3B8"
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
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={newPassword.length >= 6 ? "#10B981" : "#94A3B8"}
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
                    : "#94A3B8"
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
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
    textAlign: "center",
  },
  emailText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  resetButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
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
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  requirementsContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
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
    color: "#64748B",
  },
  requirementMet: {
    color: "#10B981",
    fontWeight: "500",
  },
});
