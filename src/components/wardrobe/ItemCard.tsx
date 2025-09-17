import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WardrobeItem } from "../../types";

interface ItemCardProps {
  item: WardrobeItem;
  onItemClick: (item: WardrobeItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onItemClick(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        {item.isFavorite && (
          <View style={styles.favoriteIcon}>
            <Ionicons name="heart" size={16} color="#ff4757" />
          </View>
        )}
        <View style={styles.wearCountBadge}>
          <Text style={styles.wearCountText}>{item.wearCount}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        <View style={styles.tagContainer}>
          <View style={[styles.colorTag, { backgroundColor: item.color }]} />
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 3 / 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  wearCountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  wearCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorTag: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  type: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "capitalize",
  },
});
