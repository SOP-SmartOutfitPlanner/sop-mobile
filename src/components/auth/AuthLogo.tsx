import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthLogoProps {
  title?: string;
  subtitle?: string;
  showEmoji?: boolean;
  emoji?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const AuthLogo: React.FC<AuthLogoProps> = ({
  title = "SOP",
  subtitle = "Style trong tầm tay – Khám phá phong cách cá nhân với AI thông minh.",
  showEmoji = false,
  emoji = "🎨",
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/img/logo_mobile.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, titleStyle]}>
          {title}
          {showEmoji && <Text style={styles.emoji}> {emoji}</Text>}
        </Text>
      </View>

      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 50,
    borderRadius: 12,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
  },
  emoji: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});
