import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  loadingText?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  variant = "primary",
  isLoading = false,
  loadingText,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}) => {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        isDisabled && styles.disabledButton,
        buttonStyle,
      ]}
      disabled={isDisabled}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
          textStyle,
        ]}
      >
        {isLoading && loadingText ? loadingText : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#6366F1",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#374151",
  },
});
