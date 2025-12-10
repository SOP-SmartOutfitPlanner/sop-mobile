import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format, isToday, isTomorrow } from "date-fns";

interface CompactDateWeatherCardProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  temperature?: number;
  weatherDescription?: string;
  cityName?: string;
  isLoadingWeather?: boolean;
}

const CompactDateWeatherCard: React.FC<CompactDateWeatherCardProps> = ({
  selectedDate,
  onDateChange,
  temperature,
  weatherDescription,
  cityName,
  isLoadingWeather,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (date && event.type === "set") {
      onDateChange(date);
    }
  };

  const getDateLabel = () => {
    if (isToday(selectedDate)) return "Today";
    if (isTomorrow(selectedDate)) return "Tomorrow";
    return format(selectedDate, "EEE");
  };

  const getWeatherIcon = () => {
    if (!weatherDescription) return "cloud-outline";
    const desc = weatherDescription.toLowerCase();
    if (desc.includes("rain") || desc.includes("drizzle")) return "rainy";
    if (desc.includes("cloud")) return "cloudy";
    if (desc.includes("clear") || desc.includes("sun")) return "sunny";
    if (desc.includes("storm") || desc.includes("thunder")) return "thunderstorm";
    return "partly-sunny";
  };

  return (
    <View style={styles.container}>
      {/* Date Section */}
      <TouchableOpacity
        style={styles.dateSection}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.dateIconBox}>
          <Ionicons name="calendar" size={20} color="#22D3EE" />
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>{getDateLabel()}</Text>
          <Text style={styles.dateText}>{format(selectedDate, "MMM d")}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Weather Section */}
      <View style={styles.weatherSection}>
        {isLoadingWeather ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : temperature !== undefined ? (
          <>
            <View style={styles.weatherIconBox}>
              <Ionicons name={getWeatherIcon()} size={22} color="#FCD34D" />
            </View>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{temperature}°C</Text>
              <Text style={styles.weatherDesc} numberOfLines={1}>
                {cityName || weatherDescription}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.noWeather}>No weather data</Text>
        )}
      </View>

      {/* Date Picker */}
      {showPicker && (
        Platform.OS === "ios" ? (
          <View style={styles.iosPickerOverlay}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.iosCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.iosPickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                minimumDate={new Date()}
                textColor="#FFFFFF"
                style={styles.iosPicker}
              />
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleChange}
            minimumDate={new Date()}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.2)",
  },
  // Date Section
  dateSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(34, 211, 238, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#22D3EE",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  // Divider
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 12,
  },
  // Weather Section
  weatherSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  weatherIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(252, 211, 77, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  weatherDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  noWeather: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  // iOS Picker
  iosPickerOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  iosPickerContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.2)",
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  iosCancelText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  iosDoneText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22D3EE",
  },
  iosPicker: {
    height: 200,
  },
});

export default CompactDateWeatherCard;
