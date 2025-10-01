import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeatherContextProps {
  temperature: number;
  description: string;
  condition: string;
  onRefresh: () => void;
}

const WeatherContext: React.FC<WeatherContextProps> = ({
  temperature,
  description,
  condition,
  onRefresh,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="cloud-outline" size={20} color="#3B82F6" />
        <Text style={styles.title}>Weather Context</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{temperature}°</Text>
          <Ionicons
            name="sunny"
            size={24}
            color="#FCD34D"
            style={styles.weatherIcon}
          />
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>{condition}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginLeft: 8,
  },
  content: {
    marginBottom: 16,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "700",
    color: "#3B82F6",
    marginRight: 8,
  },
  weatherIcon: {
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  details: {
    flexDirection: "row",
    gap: 8,
  },
  detail: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
});

export default WeatherContext;
