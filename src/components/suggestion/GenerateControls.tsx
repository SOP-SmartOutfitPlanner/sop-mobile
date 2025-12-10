import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GAP_DAY_STORAGE_KEY = "sop_gap_day_preference";

interface Occasion {
  id: string;
  name: string;
}

interface GenerateControlsProps {
  selectedOccasion: Occasion | null;
  occasions: Occasion[];
  onSelectOccasion: (occasion: Occasion) => void;
  outfitCount: number;
  onOutfitCountChange: (count: number) => void;
  gapDay: number;
  onGapDayChange: (gap: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const GenerateControls: React.FC<GenerateControlsProps> = ({
  selectedOccasion,
  occasions,
  onSelectOccasion,
  outfitCount,
  onOutfitCountChange,
  gapDay,
  onGapDayChange,
  onGenerate,
  isGenerating,
}) => {
  const [showOccasionPicker, setShowOccasionPicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGapDayChange = async (value: number) => {
    const roundedValue = Math.round(value);
    onGapDayChange(roundedValue);
    try {
      await AsyncStorage.setItem(
        GAP_DAY_STORAGE_KEY,
        roundedValue.toString()
      );
    } catch (error) {
      console.error("Error saving gap day preference:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Controls Row */}
      <View style={styles.mainRow}>
        {/* Occasion Selector */}
        <TouchableOpacity
          style={styles.occasionButton}
          onPress={() => setShowOccasionPicker(!showOccasionPicker)}
          activeOpacity={0.7}
        >
          <Ionicons name="pricetag" size={16} color="#22D3EE" />
          <Text style={styles.occasionButtonText} numberOfLines={1}>
            {selectedOccasion?.name || "Select"}
          </Text>
          <Ionicons
            name={showOccasionPicker ? "chevron-up" : "chevron-down"}
            size={14}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        {/* Outfit Count */}
        <View style={styles.countControl}>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => onOutfitCountChange(Math.max(1, outfitCount - 1))}
            disabled={outfitCount <= 1}
          >
            <Ionicons
              name="remove"
              size={18}
              color={outfitCount <= 1 ? "#4B5563" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <Text style={styles.countText}>{outfitCount}</Text>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => onOutfitCountChange(Math.min(10, outfitCount + 1))}
            disabled={outfitCount >= 10}
          >
            <Ionicons
              name="add"
              size={18}
              color={outfitCount >= 10 ? "#4B5563" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            isGenerating && styles.generateButtonDisabled,
          ]}
          onPress={onGenerate}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Occasion Picker Dropdown */}
      {showOccasionPicker && (
        <View style={styles.occasionDropdown}>
          {occasions.map((occasion) => (
            <TouchableOpacity
              key={occasion.id}
              style={[
                styles.occasionItem,
                selectedOccasion?.id === occasion.id &&
                  styles.occasionItemSelected,
              ]}
              onPress={() => {
                onSelectOccasion(occasion);
                setShowOccasionPicker(false);
              }}
            >
              <Text
                style={[
                  styles.occasionItemText,
                  selectedOccasion?.id === occasion.id &&
                    styles.occasionItemTextSelected,
                ]}
              >
                {occasion.name}
              </Text>
              {selectedOccasion?.id === occasion.id && (
                <Ionicons name="checkmark" size={16} color="#22D3EE" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Advanced Toggle */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvanced(!showAdvanced)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="options-outline"
          size={14}
          color="#9CA3AF"
        />
        <Text style={styles.advancedToggleText}>
          {showAdvanced ? "Hide" : "Show"} Advanced Settings
        </Text>
        <Ionicons
          name={showAdvanced ? "chevron-up" : "chevron-down"}
          size={14}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Advanced Settings */}
      {showAdvanced && (
        <View style={styles.advancedSection}>
          <View style={styles.gapDayRow}>
            <View style={styles.gapDayLabel}>
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text style={styles.gapDayText}>Gap Days</Text>
            </View>
            <Text style={styles.gapDayValue}>{gapDay} days</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={14}
            step={1}
            value={gapDay}
            onSlidingComplete={handleGapDayChange}
            minimumTrackTintColor="#22D3EE"
            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            thumbTintColor="#22D3EE"
          />
          <Text style={styles.gapDayHint}>
            Avoid items worn within this period
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.2)",
  },
  // Main Controls Row
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Occasion Button
  occasionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  occasionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  // Count Control
  countControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  countButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    minWidth: 24,
    textAlign: "center",
  },
  // Generate Button
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#22D3EE",
    borderRadius: 10,
  },
  generateButtonDisabled: {
    backgroundColor: "rgba(34, 211, 238, 0.5)",
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Occasion Dropdown
  occasionDropdown: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  occasionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  occasionItemSelected: {
    backgroundColor: "rgba(34, 211, 238, 0.1)",
  },
  occasionItemText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  occasionItemTextSelected: {
    color: "#22D3EE",
    fontWeight: "600",
  },
  // Advanced Toggle
  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  advancedToggleText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  // Advanced Section
  advancedSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  gapDayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gapDayLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gapDayText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  gapDayValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22D3EE",
  },
  slider: {
    width: "100%",
    height: 30,
  },
  gapDayHint: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default GenerateControls;
