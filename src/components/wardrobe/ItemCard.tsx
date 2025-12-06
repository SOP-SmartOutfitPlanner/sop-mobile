import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Item } from "../../types/item";

interface ItemCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
  const seasonColors: Record<string, string> = {
    Spring: "#ec4899",
    Summer: "#f59e0b",
    Fall: "#f97316",
    Winter: "#22d3ee",
  };

  const formattedLastWorn = useMemo(() => {
    if (!item.lastWornAt) return "Freshly added";

    try {
      const date = new Date(item.lastWornAt);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently worn";
    }
  }, [item.lastWornAt]);

  const displayedSeasons = useMemo(
    () => item.seasons?.slice(0, 3) ?? [],
    [item.seasons]
  );

  const hasSeasons = displayedSeasons.length > 0;

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => onItemClick(item)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={["#122c52", "#0b1730"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imgUrl || "https://via.placeholder.com/300x400" }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.badgeRow}>
            {item.isAnalyzed && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            )}
            {item.categoryName && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {item.categoryName}
                </Text>
              </View>
            )}
          </View>

          {!item.isAnalyzed && (
            <View style={styles.notAnalyzedBadge}>
              <Ionicons name="alert-circle" size={14} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text
            style={styles.name}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>

          {item.styles?.length > 0 && (
            <Text style={styles.subText} numberOfLines={1}>
              {item.styles.map((style) => style.name).join(", ")}
            </Text>
          )}

          <View style={styles.seasonRow}>
            {hasSeasons ? (
              displayedSeasons.map((season) => (
                <View
                  key={season.id}
                  style={[
                    styles.seasonChip,
                    { backgroundColor: seasonColors[season.name] || "#334155" },
                  ]}
                >
                  <Text style={styles.seasonChipText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {season.name}
                  </Text>
                </View>
              ))
            ) : (
              // Invisible placeholder to preserve height when no seasons
              <View style={styles.seasonPlaceholder} />
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Ionicons name="time-outline" size={14} color="#94a3b8" />
              <Text style={styles.footerText}>{formattedLastWorn}</Text>
            </View>
            <View style={styles.footerInfo}>
              <Ionicons name="analytics-outline" size={14} color="#94a3b8" />
              <Text style={styles.footerText}>
                {item.aiConfidence ? `${item.aiConfidence}%` : "Pending"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 24,
    overflow: "hidden",
  },
  container: {
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.15)",
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
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
  badgeRow: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 8,
  },
  aiBadge: {
    backgroundColor: "#22d3ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: "#22d3ee",
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  aiBadgeText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.4)",
  },
  categoryBadgeText: {
    color: "#e2e8f0",
    fontSize: 11,
    textTransform: "capitalize",
  },
  content: {
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f8fafc",
  },
  subText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  seasonRow: {
    flexDirection: "row",
    // flexWrap: "wrap",
    gap: 6,
  },
  seasonChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  seasonPlaceholder: {
    height: 18,
    opacity: 0,
  },
  seasonChipText: {
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    color: "#cbd5f5",
    fontSize: 12,
  },
});

