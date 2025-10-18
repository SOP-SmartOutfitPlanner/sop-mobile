import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GuestProfileSectionProps {
  onLoginPress: () => void;
}

export const GuestProfileSection: React.FC<GuestProfileSectionProps> = ({
  onLoginPress,
}) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.guestAvatar}>
          <Ionicons name="person-outline" size={48} color="#94A3B8" />
        </View>
      </View>
      <Text style={styles.userName}>Guest</Text>
      <Text style={styles.userBio}>
        Login to save your wardrobe, create outfits and join the fashion
        community
      </Text>

      <TouchableOpacity style={styles.loginPromptButton} onPress={onLoginPress}>
        <Text style={styles.loginPromptButtonText}>Login / Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPromptButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginPromptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});
