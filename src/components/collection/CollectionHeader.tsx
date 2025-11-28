import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLLECTION_COLORS } from "../../constants/collectionStyles";

interface CollectionHeaderProps {
  count: number;
  label?: string;
  showTrending?: boolean;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  count,
  label,
  showTrending = false,
}) => (
  <View style={styles.container}>
    <View>
      {label && (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      )}
      <Text style={styles.countText}>
        {count} {count === 1 ? "curated collection" : "curated collections"}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: COLLECTION_COLORS.accent.cyan,
    marginBottom: 4,
    fontWeight: "700",
  },
  countText: {
    fontSize: 18,
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "700",
  },
  trendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: `${COLLECTION_COLORS.accent.cyan}20`,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.accent.cyan}40`,
  },
  trendingText: {
    fontSize: 12,
    color: COLLECTION_COLORS.accent.cyan,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default CollectionHeader;
