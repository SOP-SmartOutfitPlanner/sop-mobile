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
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

interface DatePickerButtonProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  selectedDate,
  onDateChange,
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

  const handleConfirm = () => {
    setShowPicker(false);
  };

  // Format display text
  const getDisplayText = () => {
    if (isToday(selectedDate)) {
      return "Today";
    }
    if (isTomorrow(selectedDate)) {
      return "Tomorrow";
    }
    if (isYesterday(selectedDate)) {
      return "Yesterday";
    }
    return format(selectedDate, "EEE, MMM d");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected Date</Text>
      
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.dateContent}>
          <View style={styles.dateInfo}>
            <Text style={styles.dayName}>
              {format(selectedDate, "EEEE")}
            </Text>
            <Text style={styles.dateText}>
              {format(selectedDate, "MMM d, yyyy")}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={24} color="#22D3EE" />
          </View>
        </View>
        
        {/* Quick indicator for Today/Tomorrow */}
        {(isToday(selectedDate) || isTomorrow(selectedDate)) && (
          <View style={styles.quickBadge}>
            <Text style={styles.quickBadgeText}>{getDisplayText()}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.iosCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
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
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleChange}
              minimumDate={new Date()}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateButton: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.3)",
  },
  dateContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22D3EE",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(34, 211, 238, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(34, 211, 238, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22D3EE",
  },
  // iOS Picker Styles
  iosPickerContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRadius: 16,
    marginTop: 12,
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

export default DatePickerButton;
