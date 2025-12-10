import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Occasion {
  id: string;
  name: string;
}

interface GenerateControlsProps {
  selectedOccasion: Occasion | null;
  occasions: Occasion[];
  onSelectOccasion: (occasion: Occasion) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const GenerateControls: React.FC<GenerateControlsProps> = ({
  selectedOccasion,
  occasions,
  onSelectOccasion,
  onGenerate,
  isGenerating,
}) => {
  const [showOccasionPicker, setShowOccasionPicker] = useState(false);

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
});

export default GenerateControls;
