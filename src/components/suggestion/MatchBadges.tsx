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
    gap: 12,
    marginVertical: 16,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  matchText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  matchLabel: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 2,
  },
  styleBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  styleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  weatherBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weatherText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
});

export default MatchBadges;
