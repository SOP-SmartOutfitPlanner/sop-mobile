import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ColorChipProps {
  color: string;
  isSelected: boolean;
}

export const ColorChip: React.FC<ColorChipProps> = ({ color, isSelected }) => {
  return (
    <View style={styles.colorChipContent}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {color}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  colorChipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
