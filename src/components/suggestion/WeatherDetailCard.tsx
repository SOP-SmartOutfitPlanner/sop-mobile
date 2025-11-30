import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface WeatherDetailCardProps {
  title: string;
  subtitle: string;
  value1: string;
  value2?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const WeatherDetailCard: React.FC<WeatherDetailCardProps> = ({
  title,
  subtitle,
  value1,
  value2,
  icon,
  iconColor,
}) => {
  // Get gradient colors based on icon color
  const getGradientColors = (iconColor: string) => {
    if (iconColor === "#10B981") {
      return ["rgba(16, 185, 129, 0.4)", "rgba(5, 150, 105, 0.3)", "rgba(16, 185, 129, 0.4)"];
    } else if (iconColor === "#F97316") {
      return ["rgba(249, 115, 22, 0.4)", "rgba(234, 88, 12, 0.3)", "rgba(249, 115, 22, 0.4)"];
    } else if (iconColor === "#3B82F6") {
      return ["rgba(59, 130, 246, 0.4)", "rgba(37, 99, 235, 0.3)", "rgba(59, 130, 246, 0.4)"];
    } else {
      return ["rgba(100, 116, 139, 0.4)", "rgba(71, 85, 105, 0.3)", "rgba(100, 116, 139, 0.4)"];
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={getGradientColors(iconColor)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.values}>
          <Text style={styles.value}>{value1}</Text>
          {value2 && <Text style={styles.value}>{value2}</Text>}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48%", // 2 columns with gap
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },
  values: {
    gap: 6,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default WeatherDetailCard;

