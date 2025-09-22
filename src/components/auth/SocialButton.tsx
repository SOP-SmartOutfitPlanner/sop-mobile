import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SocialButtonProps extends TouchableOpacityProps {
  provider: "google" | "facebook" | "apple";
  title: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  title,
  buttonStyle,
  textStyle,
  ...props
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case "google":
        return "logo-google";
      case "facebook":
        return "logo-facebook";
      case "apple":
        return "logo-apple";
      default:
        return "logo-google";
    }
  };

  const getProviderColor = () => {
    switch (provider) {
      case "google":
        return "#4285F4";
      case "facebook":
        return "#1877F2";
      case "apple":
        return "#000000";
      default:
        return "#4285F4";
    }
  };

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} {...props}>
      <Ionicons
        name={getProviderIcon() as keyof typeof Ionicons.glyphMap}
        size={20}
        color={getProviderColor()}
      />
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
});
