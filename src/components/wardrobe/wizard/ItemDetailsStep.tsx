import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ITEM_TYPES, COLORS } from "../../../constants/wardrobe";

interface ItemDetailsStepProps {
  itemName: string;
  brand: string;
  selectedType: string;
  selectedColor: string;
  onItemNameChange: (text: string) => void;
  onBrandChange: (text: string) => void;
  onTypeSelect: (type: string) => void;
  onColorSelect: (color: string) => void;
}

export const ItemDetailsStep: React.FC<ItemDetailsStepProps> = ({
  itemName,
  brand,
  selectedType,
  selectedColor,
  onItemNameChange,
  onBrandChange,
  onTypeSelect,
  onColorSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Item Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={onItemNameChange}
          placeholder="e.g. Classic White Shirt"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Brand */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Brand (Optional)</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={onBrandChange}
          placeholder="e.g. Everlane"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Item Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Type *</Text>
        <View style={styles.typeGrid}>
          {ITEM_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                selectedType === type && styles.typeChipSelected,
              ]}
              onPress={() => onTypeSelect(type)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  selectedType === type && styles.typeChipTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorChip,
                selectedColor === color && styles.colorChipSelected,
              ]}
              onPress={() => onColorSelect(color)}
            >
              <View style={styles.colorChipContent}>
                <View
                  style={[styles.colorIndicator, { backgroundColor: color }]}
                />
                <Text
                  style={[
                    styles.colorChipText,
                    selectedColor === color && styles.colorChipTextSelected,
                  ]}
                >
                  {color}
                </Text>
              </View>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeChip: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  typeChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  typeChipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  typeChipTextSelected: {
    color: "#fff",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorChip: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  colorChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  colorChipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  colorChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  colorChipTextSelected: {
    color: "#fff",
  },
});
