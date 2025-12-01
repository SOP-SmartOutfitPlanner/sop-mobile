import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface FavoriteOutfitCard {
  id: string;
  name?: string;
  items: string[];
}

interface FavoriteOutfitsSectionProps {
  outfits: FavoriteOutfitCard[];
  onViewOutfit: (outfitId: string) => void;
  onViewAll?: () => void;
}

const BRAND_COLORS = {
  navy: "#0F172A",
  blue: "#1D4ED8",
  accent: "#F97316",
} as const;

const gradientPairs: [string, string][] = [
  [BRAND_COLORS.blue, BRAND_COLORS.navy],
  [BRAND_COLORS.accent, BRAND_COLORS.navy],
];

export const FavoriteOutfitsSection: React.FC<FavoriteOutfitsSectionProps> = ({
  outfits,
  onViewOutfit,
  onViewAll,
}) => {
  if (outfits.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Favorite Outfits</Text>
            <Text style={styles.subtitle}>Your most-loved combinations</Text>
          </View>
          {onViewAll && (
            <TouchableOpacity style={styles.linkButton} onPress={onViewAll}>
              <Text style={styles.linkText}>View all</Text>
              <Ionicons name="arrow-forward" size={16} color="#38bdf8" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={28} color="#94a3b8" />
          <Text style={styles.emptyText}>No favorite outfits yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favorite Outfits</Text>
          <Text style={styles.subtitle}>Your most-loved combinations</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity style={styles.linkButton} onPress={onViewAll}>
            <Text style={styles.linkText}>View all</Text>
            <Ionicons name="arrow-forward" size={16} color={BRAND_COLORS.blue} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsWrapper}
      >
        {outfits.map((outfit, index) => {
          const colors = gradientPairs[index % gradientPairs.length];
          return (
            <TouchableOpacity
              key={outfit.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => onViewOutfit(outfit.id)}
            >
              <LinearGradient colors={colors} style={styles.cardBackground}>
                <View style={styles.cardHeader}>
                  <Ionicons name="heart" size={16} color="#fff" />
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {outfit.name || "Unnamed outfit"}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const imageUri = outfit.items[idx];
                    return (
                      <View key={idx} style={styles.previewItem}>
                        {imageUri ? (
                          <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                          <Ionicons name="shirt-outline" size={18} color="#fff" />
                        )}
                      </View>
                    );
                  })}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardMeta}>{outfit.items.length} items</Text>
                  <View style={styles.cardCTA}>
                    <Text style={styles.cardCTAtext}>View details</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </View>
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
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
    marginTop: 4,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38bdf8",
  },
  cardsWrapper: {
    flexDirection: "row",
    gap: 14,
    paddingRight: 16,
  },
  card: {
    width: 200,
    borderRadius: 20,
  },
  cardBackground: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    gap: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
  },
  previewItem: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMeta: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  cardCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardCTAtext: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(15,23,42,0.4)",
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(226,232,240,0.6)",
    fontWeight: "500",
  },
});

