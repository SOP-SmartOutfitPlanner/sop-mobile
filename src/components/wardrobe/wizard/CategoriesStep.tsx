import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SEASONS, OCCASIONS } from "../../../constants/wardrobe";

interface CategoriesStepProps {
  selectedSeasons: string[];
  selectedOccasions: string[];
  onSeasonToggle: (season: string) => void;
  onOccasionToggle: (occasion: string) => void;
}

export const CategoriesStep: React.FC<CategoriesStepProps> = ({
  selectedSeasons,
  selectedOccasions,
  onSeasonToggle,
  onOccasionToggle,
}) => {
  return (
    <View style={styles.container}>
      {/* Seasons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seasons *</Text>
        <View style={styles.grid}>
          {SEASONS.map((season) => (
            <TouchableOpacity
              key={season}
              style={[
                styles.chip,
                selectedSeasons.includes(season) && styles.chipSelected,
              ]}
              onPress={() => onSeasonToggle(season)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSeasons.includes(season) && styles.chipTextSelected,
                ]}
              >
                {season}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Occasions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Occasions *</Text>
        <View style={styles.grid}>
          {OCCASIONS.map((occasion) => (
            <TouchableOpacity
              key={occasion}
              style={[
                styles.chip,
                selectedOccasions.includes(occasion) && styles.chipSelected,
              ]}
              onPress={() => onOccasionToggle(occasion)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedOccasions.includes(occasion) &&
                    styles.chipTextSelected,
                ]}
              >
                {occasion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
