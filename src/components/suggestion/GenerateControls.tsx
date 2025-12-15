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
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 20,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  // Main Controls Row
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Occasion Button
  occasionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  occasionButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  // Generate Button
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#22D3EE",
    borderRadius: 14,
    shadowColor: "#22D3EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  generateButtonDisabled: {
    backgroundColor: "rgba(34, 211, 238, 0.4)",
    shadowOpacity: 0.1,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  // Occasion Dropdown
  occasionDropdown: {
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxHeight: 280,
  },
  occasionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  occasionItemSelected: {
    backgroundColor: "rgba(34, 211, 238, 0.15)",
  },
  occasionItemText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  occasionItemTextSelected: {
    color: "#22D3EE",
    fontWeight: "600",
  },
});

export default GenerateControls;
