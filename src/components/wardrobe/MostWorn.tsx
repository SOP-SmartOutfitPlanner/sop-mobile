import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MostWornItem } from "../../types";

interface MostWornProps {
  items: MostWornItem[];
}

export const MostWorn: React.FC<MostWornProps> = ({ items }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tops":
        return "shirt-outline";
      case "bottoms":
        return "walk-outline";
      case "shoes":
        return "footsteps-outline";
      case "dresses":
        return "woman-outline";
      default:
        return "shirt-outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tops":
        return "#3b82f6";
      case "bottoms":
        return "#10b981";
      case "shoes":
        return "#f59e0b";
      case "dresses":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Most Worn Items</Text>
        <TouchableOpacity>
          <Ionicons name="trophy-outline" size={20} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {items.map((item, index) => {
            const categoryColor = getCategoryColor(item.category);

            return (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                {/* Rank Badge */}
                <View
                  style={[styles.rankBadge, { backgroundColor: categoryColor }]}
                >
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>

                {/* Item Image */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
                  />

                  {/* Category Icon */}
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: `${categoryColor}20` },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(item.category) as any}
                      size={14}
                      color={categoryColor}
                    />
                  </View>
                </View>

                {/* Item Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <View style={styles.wearInfo}>
                    <Ionicons name="repeat" size={14} color="#6b7280" />
                    <Text style={styles.wearCount}>{item.wearCount} times</Text>
                  </View>

                  <Text style={styles.category}>{item.category}</Text>
                </View>

                {/* Trophy for top item */}
                {index === 0 && (
                  <View style={styles.trophyContainer}>
                    <Ionicons name="trophy" size={16} color="#f59e0b" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Top Item Wears</Text>
          <Text style={styles.summaryValue}>{items[0]?.wearCount || 0}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Average Wears</Text>
          <Text style={styles.summaryValue}>
            {Math.round(
              items.reduce((sum, item) => sum + item.wearCount, 0) /
                items.length
            ) || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  itemsList: {
    flexDirection: "row",
    paddingHorizontal: 4,
    gap: 12,
  },
  itemCard: {
    width: 120,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: -8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  itemImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    lineHeight: 16,
  },
  wearInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  wearCount: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 4,
    fontWeight: "500",
  },
  category: {
    fontSize: 10,
    color: "#9ca3af",
    textTransform: "capitalize",
  },
  trophyContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 4,
  },
  summaryContainer: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
});
