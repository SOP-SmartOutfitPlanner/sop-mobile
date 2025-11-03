import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Outfit {
  id: string;
  items: string[];
  name?: string;
  favoriteCount?: number;
}

interface AllOutfitsSectionProps {
  outfits: Outfit[];
  onViewOutfit: (outfit: Outfit) => void;
}

export const AllOutfitsSection: React.FC<AllOutfitsSectionProps> = ({
  outfits,
  onViewOutfit,
}) => {
  if (outfits.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="sparkles"
            size={20}
            color="#1e293b"
            style={styles.headerIcon}
          />
          <Text style={styles.title}>All Outfits</Text>
        </View>
        <Text style={styles.count}>{outfits.length} outfits</Text>
      </View>

      <View style={styles.outfitsGrid}>
        {outfits.map((outfit) => (
          <TouchableOpacity
            key={outfit.id}
            style={styles.outfitCard}
            onPress={() => onViewOutfit(outfit)}
          >
            <View style={styles.outfitPreview}>
              {outfit.items.length > 0 ? (
                <View style={styles.itemsContainer}>
                  {outfit.items.slice(0, 2).map((item, index) => (
                    <View key={index} style={styles.itemSlot}>
                      <Image source={{ uri: item }} style={styles.itemImage} />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyPreview}>
                  <Ionicons name="shirt-outline" size={32} color="#cbd5e1" />
                </View>
              )}
            </View>

            {outfit.favoriteCount !== undefined && outfit.favoriteCount > 0 && (
              <View style={styles.favoriteIndicator}>
                <Ionicons name="heart" size={12} color="#ef4444" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  count: {
    fontSize: 14,
    color: "#64748b",
  },
  outfitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  outfitCard: {
    width: "31%",
    aspectRatio: 0.7,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  outfitPreview: {
    flex: 1,
  },
  itemsContainer: {
    flex: 1,
  },
  itemSlot: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  favoriteIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
