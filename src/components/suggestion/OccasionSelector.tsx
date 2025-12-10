import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Occasion {
  id: string;
  name: string;
  icon?: string;
}

interface OccasionSelectorProps {
  occasions: Occasion[];
  selectedOccasion: Occasion | null;
  onSelect: (occasion: Occasion) => void;
}

const OCCASION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Work: "briefcase",
  Casual: "cafe",
  Party: "beer",
  Date: "heart",
  Sport: "fitness",
  Formal: "shirt",
  Travel: "airplane",
  Beach: "sunny",
  Wedding: "diamond",
  Meeting: "people",
  School: "school",
};

const OccasionSelector: React.FC<OccasionSelectorProps> = ({
  occasions,
  selectedOccasion,
  onSelect,
}) => {
  const getIcon = (occasionName: string): keyof typeof Ionicons.glyphMap => {
    // Check if occasion name contains any known key
    for (const [key, icon] of Object.entries(OCCASION_ICONS)) {
      if (occasionName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return "pricetag";
  };

  const renderOccasion = ({ item }: { item: Occasion }) => {
    const isSelected = selectedOccasion?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.occasionChip, isSelected && styles.occasionChipSelected]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={getIcon(item.name)}
          size={16}
          color={isSelected ? "#FFFFFF" : "#9CA3AF"}
        />
        <Text
          style={[
            styles.occasionText,
            isSelected && styles.occasionTextSelected,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Occasion</Text>
      <FlatList
        data={occasions}
        renderItem={renderOccasion}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingHorizontal: 2,
  },
  occasionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  occasionChipSelected: {
    backgroundColor: "rgba(34, 211, 238, 0.9)",
    borderColor: "#22D3EE",
  },
  occasionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  occasionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default OccasionSelector;
