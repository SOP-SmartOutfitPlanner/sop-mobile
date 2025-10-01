import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";

export interface OutfitItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: ImageSourcePropType;
  status?: string;
}

interface OutfitCardProps {
  outfit: OutfitItem;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  return (
    <View style={styles.outfitCard}>
      <Image source={outfit.image} style={styles.outfitImage} />
      <View style={styles.outfitInfo}>
        <View style={styles.outfitHeader}>
          <Text style={styles.outfitTitle}>{outfit.title}</Text>
          {outfit.status && (
            <View
              style={[
                styles.statusBadge,
                outfit.status === "Winner"
                  ? styles.winnerBadge
                  : styles.runnerUpBadge,
              ]}
            >
              <Text style={styles.statusText}>{outfit.status}</Text>
            </View>
          )}
        </View>
        <View style={styles.tagsContainer}>
          {outfit.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outfitCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outfitImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F1F5F9",
  },
  outfitInfo: {
    flex: 1,
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerBadge: {
    backgroundColor: "#3B82F6",
  },
  runnerUpBadge: {
    backgroundColor: "#64748B",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
});
