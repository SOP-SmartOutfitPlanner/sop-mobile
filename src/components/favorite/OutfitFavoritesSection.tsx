import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OutfitFavoritesSection = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="star-outline" size={16} color="#6366F1" />
      <Text style={styles.text}>OUTFIT FAVORITES</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6366F1",
    letterSpacing: 1,
  },
});

export default OutfitFavoritesSection;
