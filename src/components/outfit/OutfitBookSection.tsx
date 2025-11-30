import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface OutfitPreview {
  id: string;
  items: string[]; // Array of image URLs
  name?: string;
}

interface OutfitBookSectionProps {
  outfits: OutfitPreview[];
  onViewOutfit: (outfitId: string) => void;
  onViewAllOutfits: () => void;
}

const BRAND_COLORS = {
  navy: "#0F172A",
  blue: "#1D4ED8",
  accent: "#F97316",
} as const;

// Gradient colors - using minimal color palette with blue variations
// Focused on blue tones that match the dark theme
const cardGradients: [string, string][] = [
  ["#1e3a8a", "#172554"], // Blue gradient (same as WardrobeScreen hero)
  // ["#2563eb", "#1e40af"], // Bright blue gradient
  ["#1e40af", "#1e3a8a"], // Darker blue gradient
];

export const OutfitBookSection: React.FC<OutfitBookSectionProps> = ({
  outfits,
  onViewOutfit,
  onViewAllOutfits,
}) => {
  const cards = useMemo(() => outfits.slice(0, 10), [outfits]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Outfit</Text>
          <Text style={styles.subtitle}>Your signature outfit inspirations</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllOutfits}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="arrow-forward" size={16} color="#38bdf8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.outfitsContainer}
      >
        {cards.map((outfit, index) => {
          const colors = cardGradients[index % cardGradients.length];
          const items = outfit.items.slice(0, 4);

          return (
            <TouchableOpacity
              key={outfit.id}
              style={styles.cardWrapper}
              activeOpacity={0.9}
              onPress={() => onViewOutfit(outfit.id)}
            >
              <LinearGradient colors={colors} style={styles.outfitCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardLabel}>
                    <Ionicons name="layers-outline" size={14} color="#fff" />
                    <Text style={styles.cardLabelText}>Look #{index + 1}</Text>
                  </View>
                  <View style={styles.cardChip}>
                    <Text style={styles.cardChipText}>{outfit.items.length} items</Text>
                  </View>
                </View>

                <View style={styles.outfitItems}>
                  {Array.from({ length: 4 }).map((_, slot) => {
                    const imageUri = items[slot];
                    return (
                      <View key={slot} style={styles.circleItemContainer}>
                        {imageUri ? (
                          <Image source={{ uri: imageUri }} style={styles.circleItemImage} />
                        ) : (
                          <View style={styles.circleItemPlaceholder}>
                            <Ionicons name="shirt-outline" size={18} color="#cbd5e1" />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                <Text numberOfLines={1} style={styles.cardTitle}>
                  {outfit.name || "Unnamed outfit"}
                </Text>
                <Text style={styles.cardMeta}>Tap to view details</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(56,189,248,0.15)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.2)",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#38bdf8",
  },
  outfitsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 16,
    paddingBottom: 4,
  },
  cardWrapper: {
    width: 180,
  },
  outfitCard: {
    borderRadius: 22,
    padding: 16,
    height: 210,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15,23,42,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardLabelText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  cardChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cardChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  outfitItems: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  circleItemContainer: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(15,23,42,0.4)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  circleItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  circleItemPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f8fafc",
  },
  itemPreview: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  cardMeta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },
});
