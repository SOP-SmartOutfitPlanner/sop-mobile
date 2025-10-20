import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { User } from "../../types/user";

interface StatItemData {
  value: string;
  label: string;
}

interface UserProfileSectionProps {
  user: User | null;
  stats?: StatItemData[];
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  stats = [
    { value: "1.2K", label: "Followers" },
    { value: "856", label: "Likes" },
    { value: "42", label: "Outfits" },
    { value: "8", label: "Challenges" },
  ],
}) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.avtUrl
              ? { uri: user.avtUrl }
              : require("../../../assets/adaptive-icon.png")
          }
          style={styles.avatar}
        />
      </View>
      <Text style={styles.userName}>{user?.displayName || "User"}</Text>

      {user?.location && (
        <Text style={styles.userLocation}>📍 {user.location}</Text>
      )}

      <Text style={styles.userBio}>
        {user?.bio ||
          "Fashion enthusiast & style curator. Passionate about sustainable fashion and timeless pieces."}
      </Text>

      {/* User Styles Tags */}
      {user?.userStyles && user.userStyles.length > 0 && (
        <View style={styles.stylesContainer}>
          {user.userStyles.map((style, index) => (
            <View key={index} style={styles.styleTag}>
              <Text style={styles.styleTagText}>{style}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statNumber}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E2E8F0",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  stylesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  styleTag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  styleTagText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
});
