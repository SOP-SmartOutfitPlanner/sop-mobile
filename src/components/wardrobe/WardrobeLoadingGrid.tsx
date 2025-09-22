import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface WardrobeLoadingGridProps {
  itemCount?: number;
}

export const WardrobeLoadingGrid: React.FC<WardrobeLoadingGridProps> = ({
  itemCount = 6,
}) => {
  return (
    <View style={styles.container}>
      {[...Array(itemCount)].map((_, i) => (
        <View key={i} style={styles.loadingCard}>
          <View style={styles.loadingImage} />
          <View style={styles.loadingContent}>
            <View style={styles.loadingTitle} />
            <View style={styles.loadingSubtitle} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingCard: {
    width: (width - 40) / 2 - 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingImage: {
    height: 150,
    backgroundColor: "#e5e7eb",
  },
  loadingContent: {
    padding: 12,
  },
  loadingTitle: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingSubtitle: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "60%",
  },
});
