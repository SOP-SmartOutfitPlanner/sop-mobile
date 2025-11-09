import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "../../types/item";

interface ItemCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
  const getItemTypeTag = (type: string) => {
    const tagStyles = {
      shoes: { backgroundColor: "#fef3c7", color: "#92400e", text: "shoes" },
      top: { backgroundColor: "#dbeafe", color: "#1e40af", text: "top" },
      accessory: {
        backgroundColor: "#fecaca",
        color: "#dc2626",
        text: "accessory",
      },
    };
    return tagStyles[type as keyof typeof tagStyles] || tagStyles.top;
  };

  const tag = getItemTypeTag(item.categoryName || "top");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onItemClick(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imgUrl || "https://via.placeholder.com/300x400" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View
          style={[styles.typeTag, { backgroundColor: tag.backgroundColor }]}
        >
          <Text style={[styles.typeTagText, { color: tag.color }]}>
            {tag.text}
          </Text>
        </View>
        
        {!item.isAnalyzed && (
          <View style={styles.notAnalyzedBadge}>
            <Ionicons name="alert-circle" size={14} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        
        {/* Category Badge */}
        {item.categoryName && (
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag-outline" size={12} color="#6366f1" />
            <Text style={styles.categoryText}>{item.categoryName}</Text>
          </View>
        )}
        
        {/* Analysis Status - Compact version */}
        {!item.isAnalyzed && (
          <View style={styles.analysisStatus}>
            <Ionicons name="alert-circle-outline" size={12} color="#f59e0b" />
            <Text style={styles.analysisStatusText}>Not analyzed</Text>
          </View>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={14} color="#6b7280" />
            <Text style={styles.statText}>{item.frequencyWorn || 0}</Text>
          </View>
          {item.lastWornAt && (
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text style={styles.statText}>
                {new Date(item.lastWornAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          )}
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
  typeTag: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "lowercase",
  },
  notAnalyzedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#f59e0b",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
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
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  analysisStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 2,
    marginBottom: 6,
  },
  analysisStatusText: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
});
