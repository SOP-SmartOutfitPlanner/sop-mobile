import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MatchBadgesProps {
  matchPercentage: number;
  style: string;
  weather: string;
}

const MatchBadges: React.FC<MatchBadgesProps> = ({
  matchPercentage,
  style,
  weather,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.matchBadge}>
        <Ionicons name="star" size={16} color="#FCD34D" />
        <Text style={styles.matchText}>{matchPercentage}%</Text>
        <Text style={styles.matchLabel}>Match</Text>
      </View>
      <View style={styles.styleBadge}>
        <Text style={styles.styleText}>{style}</Text>
      </View>
      <View style={styles.weatherBadge}>
        <Text style={styles.weatherText}>{weather}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  matchText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  matchLabel: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "500",
  },
  styleBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  styleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C4B5FD",
  },
  weatherBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  weatherText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#93C5FD",
  },
});

export default MatchBadges;
