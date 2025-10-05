import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CommunityStatsProps {
  members: string;
  likes: string;
  posts: string;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({
  members,
  likes,
  posts,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Ionicons name="people-outline" size={20} color="#6366F1" />
        <Text style={styles.statNumber}>{members}</Text>
        <Text style={styles.statLabel}>Members</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Ionicons name="heart-outline" size={20} color="#EC4899" />
        <Text style={styles.statNumber}>{likes}</Text>
        <Text style={styles.statLabel}>Likes</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Ionicons name="share-social-outline" size={20} color="#8B5CF6" />
        <Text style={styles.statNumber}>{posts}</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
});

export default CommunityStats;
