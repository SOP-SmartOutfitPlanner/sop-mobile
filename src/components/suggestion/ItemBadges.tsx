import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Season {
  id: number;
  name: string;
}

interface Style {
  id: number;
  name: string;
}

interface ItemBadgesProps {
  fabric?: string;
  weatherSuitable?: string;
  seasons?: Season[];
  styles?: Style[];
}

const ItemBadges: React.FC<ItemBadgesProps> = ({
  fabric,
  weatherSuitable,
  seasons,
  styles,
}) => {
  const getSeasonColor = (seasonName: string) => {
    const name = seasonName.toLowerCase();
    if (name === "spring") return { bg: "#EC4899", text: "#FFFFFF" };
    if (name === "summer") return { bg: "#FCD34D", text: "#1E293B" };
    if (name === "fall" || name === "autumn") return { bg: "#F97316", text: "#FFFFFF" };
    if (name === "winter") return { bg: "#06B6D4", text: "#FFFFFF" };
    return { bg: "#94A3B8", text: "#FFFFFF" };
  };

  const getWeatherColor = (weather?: string) => {
    if (!weather) return { bg: "#FEE2E2", text: "#DC2626" };
    const w = weather.toLowerCase();
    if (w.includes("hot")) return { bg: "#FEE2E2", text: "#DC2626" };
    if (w.includes("cold")) return { bg: "#DBEAFE", text: "#1E40AF" };
    return { bg: "#F3F4F6", text: "#374151" };
  };

  return (
    <View style={styles.container}>
      {/* Fabric */}
      {fabric && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{fabric}</Text>
        </View>
      )}

      {/* Weather */}
      {weatherSuitable && (
        <View style={[styles.badge, { backgroundColor: getWeatherColor(weatherSuitable).bg }]}>
          <Text style={[styles.badgeText, { color: getWeatherColor(weatherSuitable).text }]}>
            {weatherSuitable}
          </Text>
        </View>
      )}

      {/* Seasons */}
      {seasons && seasons.length > 0 && (
        <View style={styles.seasonsContainer}>
          {seasons.map((season) => {
            const colors = getSeasonColor(season.name);
            return (
              <View
                key={season.id}
                style={[styles.seasonBadge, { backgroundColor: colors.bg }]}
              >
                <Text style={[styles.seasonText, { color: colors.text }]}>
                  {season.name}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Styles */}
      {styles && styles.length > 0 && (
        <View style={styles.stylesContainer}>
          {styles.map((style) => (
            <View key={style.id} style={styles.styleBadge}>
              <Text style={styles.styleText}>{style.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: 0.1,
  },
  seasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  seasonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  seasonText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  stylesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  styleBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  styleText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4F46E5",
    letterSpacing: 0.1,
  },
});

export default ItemBadges;

