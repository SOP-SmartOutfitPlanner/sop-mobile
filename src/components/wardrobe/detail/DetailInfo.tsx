import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DetailInfoProps {
  name: string;
  brand?: string;
  tags?: string[];
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  name,
  brand,
  tags = [],
}) => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.itemName}>{name}</Text>
      {brand && <Text style={styles.brand}>{brand}</Text>}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  itemName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#4b5563",
  },
});
