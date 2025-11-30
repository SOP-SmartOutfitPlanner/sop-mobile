import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface AIBadgeProps {
  type?: "ai" | "suggest";
  confidence?: number;
}

const AIBadge: React.FC<AIBadgeProps> = ({ type = "ai", confidence }) => {
  if (type === "ai") {
    return (
      <View style={styles.aiBadgeContainer}>
        <View style={styles.glowEffect} />
        <LinearGradient
          colors={["#8B5CF6", "#A855F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiBadge}
        >
          <Text style={styles.aiText}>AI</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.suggestBadgeContainer}>
      <LinearGradient
        colors={["#A855F7", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.suggestBadge}
      >
        <Ionicons name="star" size={10} color="#FFFFFF" />
        <Text style={styles.suggestText}>AI Suggest</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  aiBadgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B5CF6",
    opacity: 0.4,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  aiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  aiText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  suggestBadgeContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  suggestBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default AIBadge;

