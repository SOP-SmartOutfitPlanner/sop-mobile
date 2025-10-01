import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PreferenceDropdownProps {
  label: string;
  value: string;
  onPress: () => void;
  fullWidth?: boolean;
}

const PreferenceDropdown: React.FC<PreferenceDropdownProps> = ({
  label,
  value,
  onPress,
  fullWidth = false,
}) => {
  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={styles.dropdownText}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdownText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
});

export default PreferenceDropdown;
