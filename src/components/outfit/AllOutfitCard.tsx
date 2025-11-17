import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface AllOutfitCardData {
  id: string;
  items: string[];
  name?: string;
  favoriteCount?: number;
  userDisplayName?: string;
  createdDate?: string;
  description?: string;
  totalItems?: number;
}

interface AllOutfitCardProps {
  outfit: AllOutfitCardData;
  onPress: (outfitId: string) => void;
}

const formatOutfitDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOwnerName = (name?: string) => {
  if (!name || name.trim().length === 0) {
    return "You";
  }
  return name;
};

export const AllOutfitCard: React.FC<AllOutfitCardProps> = ({ outfit, onPress }) => {
  const itemsToDisplay = outfit.items.slice(0, 4);
  const remainingItems = Math.max(0, outfit.items.length - 4);
  const totalItems = outfit.totalItems ?? outfit.items.length;

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      activeOpacity={0.92}
      onPress={() => onPress(outfit.id)}
    >
      <LinearGradient colors={["#193C8A", "#121F4A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.imagesGrid}>
          {Array.from({ length: 4 }).map((_, index) => {
            const imageUri = itemsToDisplay[index];
            const isMoreBadge = index === 3 && remainingItems > 0;

            return (
              <View key={index} style={styles.imageSlot}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="shirt-outline" size={20} color="#94a3b8" />
                  </View>
                )}
                {isMoreBadge && (
                  <View style={styles.moreBadge}>
                    <Text style={styles.moreBadgeText}>+{remainingItems} more</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text numberOfLines={1} style={styles.cardTitle}>
          {outfit.name || "Unnamed outfit"}
        </Text>
        <Text numberOfLines={2} style={styles.cardDescription}>
          {outfit.description?.trim() || "Add a description for your outfit"}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#cbd5ff" />
            <Text numberOfLines={1} style={styles.metaText}>
              {getOwnerName(outfit.userDisplayName)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#cbd5ff" />
            <Text numberOfLines={1} style={styles.metaText}>
              {formatOutfitDate(outfit.createdDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.itemsCount}>{totalItems} items</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => onPress(outfit.id)}>
          <Text style={styles.primaryButtonText}>Use Outfit Today</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    minHeight: 260,
    gap: 12,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  imageSlot: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1C2F5C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moreBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moreBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
  },
  cardDescription: {
    fontSize: 12,
    color: "#cbd5ff",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 6,
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexBasis: "48%",
  },
  metaText: {
    color: "#dbeafe",
    fontSize: 12,
    flexShrink: 1,
  },
  itemsCount: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1d4ed8",
  },
});


