import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CollectionHeaderProps {
  count: number;
  showTrending?: boolean;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  count,
  showTrending = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.countText}>{count} collections found</Text>
      {showTrending && (
        <View style={styles.trendingContainer}>
          <Ionicons name="trending-up" size={16} color="#6366F1" />
          <Text style={styles.trendingText}>Trending</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  trendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendingText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
});

export default CollectionHeader;
