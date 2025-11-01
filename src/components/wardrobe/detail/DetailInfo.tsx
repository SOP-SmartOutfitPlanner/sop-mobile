import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DetailInfoProps {
  name: string;
  brand?: string;
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  name,
  brand,
}) => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.itemName}>{name}</Text>
      {brand && <Text style={styles.brand}>{brand}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderBottomColor: "#f9fafb",
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
  },
});
