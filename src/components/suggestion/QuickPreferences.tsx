import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PreferenceDropdown from "./PreferenceDropdown";

interface QuickPreferencesProps {
  goal: string;
  occasion: string;
  season: string;
  onGoalPress: () => void;
  onOccasionPress: () => void;
  onSeasonPress: () => void;
  onGenerate: () => void;
}

const QuickPreferences: React.FC<QuickPreferencesProps> = ({
  goal,
  occasion,
  season,
  onGoalPress,
  onOccasionPress,
  onSeasonPress,
  onGenerate,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="options-outline" size={20} color="#6366F1" />
        <Text style={styles.title}>Quick Preferences</Text>
      </View>

      <View style={styles.row}>
        <PreferenceDropdown label="Goal" value={goal} onPress={onGoalPress} />
        <PreferenceDropdown
          label="Occasion"
          value={occasion}
          onPress={onOccasionPress}
        />
      </View>

      <View style={styles.row}>
        <PreferenceDropdown
          label="Season"
          value={season}
          onPress={onSeasonPress}
          fullWidth
        />
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={onGenerate}>
        <Ionicons name="flash" size={20} color="#FFFFFF" />
        <Text style={styles.generateButtonText}>Generate Outfit</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default QuickPreferences;
