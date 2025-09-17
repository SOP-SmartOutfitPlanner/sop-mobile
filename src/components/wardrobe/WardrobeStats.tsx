import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WardrobeStats as WardrobeStatsType } from "../../types";

interface WardrobeStatsProps {
  stats: WardrobeStatsType;
}

export const WardrobeStats: React.FC<WardrobeStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const statsData = [
    {
      icon: "shirt-outline" as const,
      label: "Total Items",
      value: stats.totalItems.toString(),
      color: "#3b82f6",
    },
    {
      icon: "pricetag-outline" as const,
      label: "Total Value",
      value: formatCurrency(stats.totalValue),
      color: "#10b981",
    },
    {
      icon: "repeat-outline" as const,
      label: "Avg. Wear Count",
      value: stats.averageWearCount.toString(),
      color: "#f59e0b",
    },
    {
      icon: "trending-up-outline" as const,
      label: "Cost Per Wear",
      value: formatCurrency(stats.costPerWear),
      color: "#8b5cf6",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wardrobe Statistics</Text>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}
            >
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStats}>
        <View style={styles.statRow}>
          <View style={styles.statRowContent}>
            <Ionicons name="heart" size={16} color="#ef4444" />
            <Text style={styles.statRowLabel}>Favorite Items</Text>
          </View>
          <Text style={styles.statRowValue}>{stats.favoriteItems}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statRowContent}>
            <Ionicons name="trending-up" size={16} color="#3b82f6" />
            <Text style={styles.statRowLabel}>Most Worn Category</Text>
          </View>
          <Text style={[styles.statRowValue, { textTransform: "capitalize" }]}>
            {stats.mostWornCategory}
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statRowContent}>
            <Ionicons name="card" size={16} color="#10b981" />
            <Text style={styles.statRowLabel}>Monthly Spending</Text>
          </View>
          <Text style={styles.statRowValue}>
            {formatCurrency(stats.monthlySpending)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statRowContent}>
            <Ionicons
              name="leaf"
              size={16}
              color={getScoreColor(stats.sustainabilityScore)}
            />
            <Text style={styles.statRowLabel}>Sustainability Score</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.scoreValue,
                { color: getScoreColor(stats.sustainabilityScore) },
              ]}
            >
              {stats.sustainabilityScore}
            </Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 16,
  },
  statCard: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  additionalStats: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statRowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statRowLabel: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreMax: {
    fontSize: 12,
    color: "#6b7280",
  },
});
