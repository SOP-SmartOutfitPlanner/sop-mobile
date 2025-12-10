import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";

interface GapDaysSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

const GapDaysSlider: React.FC<GapDaysSliderProps> = ({
  value,
  onValueChange,
  minValue = 0,
  maxValue = 14,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Gap Days</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#22D3EE"
        maximumTrackTintColor="rgba(34, 211, 238, 0.2)"
        thumbTintColor="#22D3EE"
      />

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{minValue}</Text>
        <Text style={styles.rangeLabel}>{maxValue}</Text>
      </View>

      <Text style={styles.description}>
        Prevent repeating items worn within ±{value} days of the selected date
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22D3EE",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -8,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  description: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    lineHeight: 18,
  },
});

export default GapDaysSlider;
