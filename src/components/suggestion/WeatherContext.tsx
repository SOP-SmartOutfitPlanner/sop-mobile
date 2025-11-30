import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DailyForecast } from "../../types/weather";
import WeatherDetailCard from "./WeatherDetailCard";

interface WeatherContextProps {
  temperature: number;
  description: string;
  condition: string;
  onRefresh: () => void;
  cityName?: string;
  forecast?: DailyForecast;
}

const WeatherContext: React.FC<WeatherContextProps> = ({
  temperature,
  description,
  condition,
  onRefresh,
  cityName,
  forecast,
}) => {
  // Helper to get wind direction abbreviation
  const getWindDirection = (degrees?: number): string => {
    if (degrees === undefined) return "N/A";
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Get weather icon name
  const getWeatherIcon = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("rain") || d.includes("drizzle")) return "rainy";
    if (d.includes("cloud")) return "cloudy";
    if (d.includes("clear") || d.includes("sunny")) return "sunny";
    if (d.includes("wind")) return "partly-sunny";
    return "partly-sunny";
  };

  // Get short location name (first part before comma)
  const getShortLocation = (fullLocation?: string) => {
    if (!fullLocation) return "Your Location";
    const parts = fullLocation.split(",");
    return parts[0].trim();
  };

  return (
    <View style={styles.container}>
      {/* Main Weather Card - Large Purple Card - Simplified Layout */}
      <LinearGradient
        colors={[
          "rgba(139, 92, 246, 0.8)",
          "rgba(124, 58, 237, 0.7)",
          "rgba(139, 92, 246, 0.8)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainCard}
      >
        <View style={styles.mainCardContent}>
          {/* Location and Temperature Row */}
          <View style={styles.topRow}>
            {/* Location - Left */}
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#FFFFFF" />
              <Text style={styles.locationText}>
                {getShortLocation(cityName)}
              </Text>
      </View>

            {/* Temperature and Icon - Right */}
            <View style={styles.tempRight}>
              <View style={styles.weatherIconContainer}>
          <Ionicons
                  name={getWeatherIcon(description)}
                  size={32}
                  color="#FFFFFF"
          />
        </View>
              <View style={styles.tempColumn}>
                <Text style={styles.temperature}>{temperature}°</Text>
                {forecast?.feelsLike && (
                  <Text style={styles.feelsLikeText}>
                    Feels {Math.round(forecast.feelsLike)}°
                  </Text>
                )}
        </View>
      </View>
          </View>

          {/* Description - Below */}
          <Text style={styles.description}>{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  mainCardContent: {
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tempRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weatherIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  tempColumn: {
    alignItems: "flex-end",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 56,
  },
  feelsLikeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
});

export default WeatherContext;
