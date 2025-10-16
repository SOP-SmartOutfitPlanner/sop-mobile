import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoutButtonProps {
  onLogout: () => void;
  disabled?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, disabled = false }) => {
  return (
    <View style={styles.logoutContainer}>
      <TouchableOpacity 
        style={[styles.logoutButton, disabled && styles.logoutButtonDisabled]} 
        onPress={onLogout}
        disabled={disabled}
      >
        {disabled ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        )}
        <Text style={[styles.logoutText, disabled && styles.logoutTextDisabled]}>
          {disabled ? "Đang đăng xuất..." : "Đăng xuất"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
  logoutTextDisabled: {
    opacity: 0.7,
  },
});
