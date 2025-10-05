import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeeklyChallengeCardProps {
  title: string;
  description: string;
  timeLeft: string;
  submissions: number;
  onJoinPress: () => void;
}

const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({
  title,
  description,
  timeLeft,
  submissions,
  onJoinPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="trophy" size={16} color="#FFFFFF" />
          <Text style={styles.badgeText}>Weekly Challenge</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.infoLabel}>Ends in {timeLeft}</Text>
          <Text style={styles.infoValue}>{submissions} submissions</Text>
        </View>
        <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6366F1",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statusBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  info: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  joinButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
});

export default WeeklyChallengeCard;
