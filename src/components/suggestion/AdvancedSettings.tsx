import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GapDaysSlider from "./GapDaysSlider";

interface AdvancedSettingsProps {
  gapDay: number;
  onGapDayChange: (value: number) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  gapDay,
  onGapDayChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.toggleLeft}>
          <Ionicons name="sparkles" size={16} color="#22D3EE" />
          <Text style={styles.toggleText}>Advanced Settings</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#22D3EE"
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.divider} />
          <GapDaysSlider
            value={gapDay}
            onValueChange={onGapDayChange}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22D3EE",
  },
  content: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(34, 211, 238, 0.2)",
    marginBottom: 12,
  },
});

export default AdvancedSettings;
