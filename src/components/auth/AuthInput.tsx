import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  style,
  ...props
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <Ionicons
        name={icon}
        size={20}
        color="#9CA3AF"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {showPasswordToggle && (
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
});
