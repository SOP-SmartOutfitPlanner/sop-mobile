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
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

interface ForgotPasswordProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const { isLoading, sendOtp } = useForgotPassword();

  const handleSendOtp = async () => {
    // Validation
    if (!email.trim()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    const success = await sendOtp(email);
    if (success) {
      navigation.navigate("VerifyOtpReset", { email });
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you an OTP code to reset
              your password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#94A3B8"
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
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send OTP Code</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#3B82F6"
            />
            <Text style={styles.infoText}>
              OTP code will be valid for 15 minutes
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
    marginBottom: 24,
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
  sendButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
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
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
});
