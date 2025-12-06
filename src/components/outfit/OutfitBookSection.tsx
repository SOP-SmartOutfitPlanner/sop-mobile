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

// Gradient colors - using minimal color palette with blue variations
const cardGradients: [string, string][] = [
  ["#1e3a8a", "#172554"], // Blue gradient
  ["#1e40af", "#1e3a8a"], // Darker blue gradient
  ["#2563eb", "#1e40af"], // Bright blue gradient
  ["#3b82f6", "#2563eb"], // Lighter blue gradient
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
              activeOpacity={0.85}
              onPress={() => onViewOutfit(outfit.id)}
            >
              <LinearGradient colors={colors} style={styles.outfitCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardChip}>
                    <Ionicons name="shirt" size={12} color="#fff" />
                    <Text style={styles.cardChipText}>{outfit.items.length}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onViewOutfit(outfit.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={14} color="#38bdf8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.outfitItems}>
                  {Array.from({ length: 4 }).map((_, slot) => {
                    const imageUri = items[slot];
                    return (
                      <View key={slot} style={styles.itemContainer}>
                        {imageUri ? (
                          <Image source={{ uri: imageUri }} style={styles.itemImage} />
                        ) : (
                          <View style={styles.itemPlaceholder}>
                            <Ionicons name="shirt-outline" size={20} color="rgba(203,213,225,0.5)" />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
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
    width: 200,
  },
  outfitCard: {
    borderRadius: 24,
    padding: 18,
    height: 240,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardChipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  viewButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(56,189,248,0.2)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  outfitItems: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
    minHeight: 140,
  },
  itemContainer: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(15,23,42,0.5)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  cardMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
});
