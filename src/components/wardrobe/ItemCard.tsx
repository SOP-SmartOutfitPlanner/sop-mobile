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

  // Check if item needs analysis or has low confidence
  const needsAttention = !item.isAnalyzed || (item.aiConfidence !== undefined && item.aiConfidence < 50);
  const hasLowConfidence = item.aiConfidence !== undefined && item.aiConfidence < 50;

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
        />
        <View
          style={[styles.typeTag, { backgroundColor: tag.backgroundColor }]}
        >
          <Text style={[styles.typeTagText, { color: tag.color }]}>
            {tag.text}
          </Text>
        </View>
        
        {/* Warning badge for low confidence or unanalyzed */}
        {needsAttention && (
          <View style={styles.warningBadge}>
            <Ionicons 
              name={hasLowConfidence ? "warning" : "analytics-outline"} 
              size={16} 
              color="#fff" 
            />
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
        
        {/* Show confidence score if analyzed */}
        {item.isAnalyzed && item.aiConfidence !== undefined && (
          <View style={styles.confidenceContainer}>
            <View 
              style={[
                styles.confidenceBadge, 
                { backgroundColor: item.aiConfidence >= 50 ? '#dcfce7' : '#fee2e2' }
              ]}
            >
              <Text 
                style={[
                  styles.confidenceText,
                  { color: item.aiConfidence >= 50 ? '#16a34a' : '#dc2626' }
                ]}
              >
                {item.aiConfidence}% {item.aiConfidence >= 50 ? '✓' : '!'}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.wearInfo}>
            <Ionicons name="eye-outline" size={12} color="#6b7280" />
            <Text style={styles.wearText}>{item.frequencyWorn}</Text>
          </View>
          <Text style={styles.lastWorn}>
            {item.lastWornAt
              ? new Date(item.lastWornAt).toLocaleDateString()
              : "-"}
          </Text>
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
  warningBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    width: 24,
    height: 24,
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
    marginBottom: 2,
  },
  brand: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  confidenceContainer: {
    marginBottom: 8,
  },
  confidenceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wearInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  wearText: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 4,
  },
  lastWorn: {
    fontSize: 11,
    color: "#6b7280",
  },
});
