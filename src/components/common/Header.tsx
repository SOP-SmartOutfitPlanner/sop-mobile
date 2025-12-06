import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Bell, MessageCircle, ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, SHADOWS } from "../../constants/homeStyles";
import { useAuth } from "@/hooks/auth";
import { Image } from "expo-image";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showNotification?: boolean;
  showMessage?: boolean;
  showProfile?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onMessagePress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Home",
  showBackButton = false,
  showNotification = true,
  showMessage = true,
  showProfile = true,
  onBackPress,
  onNotificationPress,
  onMessagePress,
  onProfilePress,
  subtitle,
}) => {
  const { user, isGuest, logout, loadUserProfile } = useAuth();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient
        colors={["#0f172a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientWrapper}
      >
        <View style={styles.container}>
          {showBackButton ? (
            <TouchableOpacity
              style={[styles.iconButton, styles.backButton]}
              onPress={onBackPress}
              activeOpacity={0.85}
            >
              <ArrowLeft size={18} color="#e2e8f0" />
            </TouchableOpacity>
          ) : null}

          <View style={styles.titleWrapper}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            {subtitle && (
              <Text numberOfLines={1} style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>

          <View style={styles.rightSection}>
            {showNotification && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.85}
              >
                <Bell size={18} color="#e2e8f0" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            )}

            {showProfile && (
              <TouchableOpacity
                style={styles.profileButton}
                onPress={onProfilePress}
                activeOpacity={0.9}
              >
                <View style={styles.avatar}>
                  {user?.avtUrl ? (
                    <Image source={{ uri: user.avtUrl }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="person" size={18} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#050816",
  },
  gradientWrapper: {
    ...SHADOWS.card,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: SPACING.md,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.8)",
    marginTop: 2,
  },
  titleWrapper: {
    flex: 1,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#f87171",
    shadowColor: "#f87171",
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  profileButton: {
    marginLeft: SPACING.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});
