import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/auth";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={20} color="#EF4444" />
      <Text style={styles.logoutText}>Đăng xuất</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
});
