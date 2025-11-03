import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarDay {
  dayOfWeek: string;
  date: string;
  fullDate: Date;
  temperature?: string;
  weather?: string;
  isToday?: boolean;
}

interface OutfitCalendarProps {
  days: CalendarDay[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onViewAll: () => void;
}

export const OutfitCalendar: React.FC<OutfitCalendarProps> = ({
  days,
  selectedDate,
  onSelectDate,
  onViewAll,
}) => {
  const getWeatherIcon = (weather?: string) => {
    if (!weather) return "calendar-outline";
    if (weather.includes("rain")) return "rainy";
    if (weather.includes("cloud")) return "cloudy";
    return "partly-sunny";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Outfit Calendar</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View Calendar</Text>
          <Ionicons name="chevron-forward" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {days.map((day, index) => {
          const isSelected =
            selectedDate &&
            day.fullDate.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                day.isToday && styles.dayCardToday,
              ]}
              onPress={() => onSelectDate(day.fullDate)}
            >
              <Text style={styles.dayOfWeek}>
                {day.isToday ? "Today" : day.dayOfWeek}
              </Text>
              <Text style={styles.date}>{day.date}</Text>

              {day.weather && day.temperature ? (
                <View style={styles.weatherContainer}>
                  <Ionicons
                    name={getWeatherIcon(day.weather) as any}
                    size={20}
                    color="#64748b"
                  />
                  <Text style={styles.temperature}>{day.temperature}</Text>
                </View>
              ) : (
                <View style={styles.emptyOutfit}>
                  <Ionicons name="calendar-outline" size={24} color="#cbd5e1" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 4,
  },
  daysContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    minWidth: 120,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    alignItems: "center",
  },
  dayCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  dayCardToday: {
    borderColor: "#1e293b",
  },
  dayOfWeek: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  weatherContainer: {
    alignItems: "center",
    gap: 4,
  },
  temperature: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyOutfit: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
