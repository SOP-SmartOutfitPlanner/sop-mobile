import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DetailStatsProps {
  wearCount: string;
  condition: "New" | "Good" | "Fair" | "Poor";
  lastWorn?: string;
}

export const DetailStats: React.FC<DetailStatsProps> = ({
  wearCount,
  condition,
  lastWorn,
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "#10b981";
      case "Good":
        return "#3b82f6";
      case "Fair":
        return "#f59e0b";
      case "Poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <LinearGradient
          colors={["#30cfd0", "#330867"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statIconContainer}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.statLabel}>Worn</Text>
        <Text style={styles.statValue}>{wearCount}</Text>
      </View>

      <View style={styles.statItem}>
        <LinearGradient
          colors={["#30cfd0", "#330867"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statIconContainer}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.statLabel}>Condition</Text>
        <Text
          style={[styles.statValue, { color: getConditionColor(condition) }]}
        >
          {condition}
        </Text>
      </View>

      {lastWorn && (
        <View style={styles.statItem}>
          <LinearGradient
            colors={["#30cfd0", "#330867"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statIconContainer}
          >
            <Ionicons name="time" size={20} color="#fff" />
          </LinearGradient>
          <Text style={styles.statLabel}>Last Worn</Text>
          <Text style={styles.statValue}>{lastWorn}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
});
