import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DeclutterHint } from "../../types";

interface DeclutterHintsProps {
  hints: DeclutterHint[];
}

export const DeclutterHints: React.FC<DeclutterHintsProps> = ({ hints }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "warning";
      case "medium":
        return "alert-circle";
      case "low":
        return "information-circle";
      default:
        return "help-circle";
    }
  };

  const getHintIcon = (title: string) => {
    if (title.includes("Unworn")) return "time-outline";
    if (title.includes("Duplicate")) return "copy-outline";
    if (title.includes("condition")) return "build-outline";
    if (title.includes("size")) return "resize-outline";
    return "bulb-outline";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Declutter Hints</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalText}>
              {hints.reduce((sum, hint) => sum + hint.itemCount, 0)} items
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {hints.map((hint) => {
          const priorityColor = getPriorityColor(hint.priority);

          return (
            <TouchableOpacity key={hint.id} style={styles.hintCard}>
              <View style={styles.hintHeader}>
                <View style={styles.hintInfo}>
                  <View
                    style={[
                      styles.hintIcon,
                      { backgroundColor: `${priorityColor}20` },
                    ]}
                  >
                    <Ionicons
                      name={getHintIcon(hint.title) as any}
                      size={16}
                      color={priorityColor}
                    />
                  </View>
                  <View style={styles.hintText}>
                    <Text style={styles.hintTitle}>{hint.title}</Text>
                    <Text style={styles.hintDescription}>
                      {hint.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.hintMeta}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: priorityColor },
                    ]}
                  >
                    <Ionicons
                      name={getPriorityIcon(hint.priority) as any}
                      size={12}
                      color="#fff"
                    />
                    <Text style={styles.priorityText}>{hint.priority}</Text>
                  </View>
                  <Text style={styles.itemCount}>{hint.itemCount} items</Text>
                </View>
              </View>

              <View style={styles.actionSection}>
                <View style={styles.suggestionContainer}>
                  <Ionicons name="lightbulb" size={14} color="#f59e0b" />
                  <Text style={styles.suggestionText}>
                    {hint.actionSuggestion}
                  </Text>
                </View>

                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Items</Text>
                  <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.startButton}>
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.startButtonText}>Start Decluttering</Text>
        </TouchableOpacity>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginRight: 8,
  },
  totalBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  hintCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e5e7eb",
  },
  hintHeader: {
    marginBottom: 12,
  },
  hintInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  hintIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  hintText: {
    flex: 1,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  hintDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  hintMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 4,
    textTransform: "uppercase",
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
  },
  actionSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
    marginRight: 4,
  },
  actionBar: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 6,
  },
});
