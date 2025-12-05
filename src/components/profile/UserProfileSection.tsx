import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../../types/user";

interface StatItemData {
  value: string;
  label: string;
}

interface UserProfileSectionProps {
  user: User | null;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
}

const formatStatValue = (value?: number | null) => {
  if (value === undefined || value === null) return "0";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${value}`;
};

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  isOwnProfile = true,
  onEditProfile,
  onShareProfile,
}) => {
  const stats: StatItemData[] = [
    { value: formatStatValue(user?.followersCount), label: "Followers" },
    { value: formatStatValue(user?.followingCount), label: "Following" },
    { value: formatStatValue(user?.postsCount), label: "Posts" },
  ];

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

      {(user?.jobName || user?.isStylist || user?.isPremium) && (
        <View style={styles.badgeRow}>
          {user?.jobName && (
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{user.jobName}</Text>
            </View>
          )}
          {user?.isStylist && (
            <View style={[styles.badgePill, styles.badgeStylist]}>
              <Ionicons name="cut-outline" size={14} color="#F97316" />
              <Text style={[styles.badgeText, styles.badgeStylistText]}>
                Stylist
              </Text>
            </View>
          )}
          {user?.isPremium && (
            <View style={[styles.badgePill, styles.badgePremium]}>
              <Ionicons name="sparkles-outline" size={14} color="#FACC15" />
              <Text style={[styles.badgeText, styles.badgePremiumText]}>
                Premium
              </Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.userBio}>
        {user?.bio ||
          "Fashion enthusiast & style curator. Passionate about sustainable fashion and timeless pieces."}
      </Text>

      {/* User Styles Tags */}
      {user?.userStyles && user.userStyles.length > 0 && (
        <View style={styles.stylesContainer}>
          {user.userStyles.map((style) => (
            <View key={style.id} style={styles.styleTag}>
              <Text style={styles.styleTagText}>{style.styleName}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statIconCircle}>
              {stat.label === "Followers" && (
                <Ionicons name="people-outline" size={16} color="#38BDF8" />
              )}
              {stat.label === "Following" && (
                <Ionicons name="person-add-outline" size={16} color="#A855F7" />
              )}
              {stat.label === "Posts" && (
                <Ionicons name="albums-outline" size={16} color="#F97316" />
              )}
            </View>
            <Text style={styles.statNumber}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onEditProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={16} color="#0F172A" />
              <Text style={styles.primaryButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onShareProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="share-social-outline" size={16} color="#E0F2FE" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onEditProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={16} color="#0F172A" />
              <Text style={styles.primaryButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onShareProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="share-social-outline" size={16} color="#E0F2FE" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "transparent",
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
    color: "#E5E7EB",
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 13,
    color: "#CBD5F5",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#E2E8F0",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
  },
  badgeText: {
    fontSize: 12,
    color: "#E5E7EB",
    fontWeight: "600",
  },
  badgeStylist: {
    backgroundColor: "rgba(248, 250, 252, 0.04)",
    borderColor: "rgba(249, 115, 22, 0.7)",
  },
  badgeStylistText: {
    color: "#FDBA74",
  },
  badgePremium: {
    backgroundColor: "rgba(248, 250, 252, 0.04)",
    borderColor: "rgba(250, 204, 21, 0.7)",
  },
  badgePremiumText: {
    color: "#FACC15",
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
    backgroundColor: "rgba(15,23,42,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.6)",
  },
  styleTagText: {
    fontSize: 12,
    color: "#E0F2FE",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.85)",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  statIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#CBD5F5",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#22D3EE",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.7)",
    backgroundColor: "rgba(15,23,42,0.7)",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E0F2FE",
  },
});
