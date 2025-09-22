import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Bell, MessageCircle, ArrowLeft } from "lucide-react-native";
import { COLORS, SPACING, SHADOWS } from "../../constants/homeStyles";

interface HeaderProps {
  title?: string;
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
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
              <ArrowLeft size={20} color={COLORS.text.primary} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {showNotification && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
            >
              <Bell size={20} color={COLORS.text.secondary} />
              {/* Notification badge */}
              <View style={styles.notificationBadge}>
                <View style={styles.badgeDot} />
              </View>
            </TouchableOpacity>
          )}

          {showMessage && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMessagePress}
            >
              <MessageCircle size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    ...SHADOWS.card,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
  placeholder: {
    width: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  profileButton: {
    marginLeft: SPACING.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
