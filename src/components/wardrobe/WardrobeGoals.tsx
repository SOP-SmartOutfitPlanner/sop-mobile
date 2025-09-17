import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WardrobeGoal } from "../../types";

interface WardrobeGoalsProps {
  goals: WardrobeGoal[];
}

export const WardrobeGoals: React.FC<WardrobeGoalsProps> = ({ goals }) => {
  const getProgressPercentage = (goal: WardrobeGoal) => {
    return Math.min((goal.progress / goal.target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sustainability":
        return "leaf-outline";
      case "utilization":
        return "repeat-outline";
      case "organization":
        return "albums-outline";
      default:
        return "flag-outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sustainability":
        return "#10b981";
      case "utilization":
        return "#3b82f6";
      case "organization":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wardrobe Goals</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {goals.map((goal) => {
        const progressPercentage = getProgressPercentage(goal);
        const categoryColor = getCategoryColor(goal.category);

        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${categoryColor}20` },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(goal.category) as any}
                    size={16}
                    color={categoryColor}
                  />
                </View>
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </View>
              <View style={styles.progressText}>
                <Text style={styles.progressNumbers}>
                  {goal.progress}/{goal.target}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: categoryColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          </View>
        );
      })}
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
  goalCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 16,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  progressText: {
    alignItems: "flex-end",
  },
  progressNumbers: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    minWidth: 30,
    textAlign: "right",
  },
});
