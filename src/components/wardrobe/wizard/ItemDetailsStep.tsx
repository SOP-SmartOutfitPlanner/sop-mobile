import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import type { Category } from "../../../types/category";
import type { ColorItem } from "../../../types/item";
import { useItemMetadata } from "../../../hooks/useItemMetadata";
import { ColorSelector } from "../ColorSelector";

interface ItemDetailsStepProps {
  itemName: string;
  brand: string;
  categoryId: number;
  selectedColors: ColorItem[];
  weatherSuitable: string;
  condition: string;
  pattern: string;
  fabric: string;
  selectedStyles: number[];
  selectedOccasions: number[];
  selectedSeasons: number[];
  parentCategories: Category[];
  childCategories: Category[];
  isCategoriesLoading: boolean;
  isLoadingChildren: boolean;
  onItemNameChange: (text: string) => void;
  onBrandChange: (text: string) => void;
  onCategorySelect: (categoryId: number, categoryName: string) => void;
  onFetchChildCategories: (parentId: number) => Promise<Category[]>;
  onColorToggle: (color: ColorItem) => void;
  onWeatherSuitableChange: (text: string) => void;
  onConditionChange: (text: string) => void;
  onPatternChange: (text: string) => void;
  onFabricChange: (text: string) => void;
  onStyleToggle: (styleId: number) => void;
  onOccasionToggle: (occasionId: number) => void;
  onSeasonToggle: (seasonId: number) => void;
}

export const ItemDetailsStep: React.FC<ItemDetailsStepProps> = ({
  itemName,
  brand,
  categoryId,
  selectedColors,
  weatherSuitable,
  condition,
  pattern,
  fabric,
  selectedStyles,
  selectedOccasions,
  selectedSeasons,
  parentCategories,
  childCategories,
  isCategoriesLoading,
  isLoadingChildren,
  onItemNameChange,
  onBrandChange,
  onCategorySelect,
  onFetchChildCategories,
  onColorToggle,
  onWeatherSuitableChange,
  onConditionChange,
  onPatternChange,
  onFabricChange,
  onStyleToggle,
  onOccasionToggle,
  onSeasonToggle,
}) => {
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Fetch metadata from API
  const { 
    styles: stylesData, 
    occasions: occasionsData, 
    seasons: seasonsData, 
    isLoading: isMetadataLoading 
  } = useItemMetadata();

  // Helper function to scroll to bottom when keyboard appears
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 100 : 150,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
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
          <Text style={styles.label}>Brand </Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={onBrandChange}
            placeholder="e.g. Everlane"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          
          {/* Parent Categories */}
          <Text style={styles.subSectionTitle}>Select Parent Category</Text>
          {isCategoriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading parent categories...</Text>
            </View>
          ) : (
            <View style={styles.typeGrid}>
              {parentCategories.map((parent) => (
                <TouchableOpacity
                  key={parent.id}
                  style={[
                    styles.typeChip,
                    selectedParentId === parent.id && styles.typeChipSelected,
                  ]}
                  onPress={async () => {
                    setSelectedParentId(parent.id);
                    await onFetchChildCategories(parent.id);
                  }}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      selectedParentId === parent.id && styles.typeChipTextSelected,
                    ]}
                  >
                    {parent.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Child Categories - Show only when parent is selected */}
          {selectedParentId && (
            <>
              <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>
                Select Specific Category
              </Text>
              {isLoadingChildren ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : childCategories.length > 0 ? (
                <View style={styles.typeGrid}>
                  {childCategories.map((child) => (
                    <TouchableOpacity
                      key={child.id}
                      style={[
                        styles.typeChip,
                        categoryId === child.id && styles.typeChipSelected,
                      ]}
                      onPress={() => onCategorySelect(child.id, child.name)}
                    >
                      <Text
                        style={[
                          styles.typeChipText,
                          categoryId === child.id && styles.typeChipTextSelected,
                        ]}
                      >
                        {child.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.helperText}>
                  No subcategories available for this category.
                </Text>
              )}
            </>
          )}
        </View>

        {/* Color */}
        <ColorSelector
          selectedColors={selectedColors}
          onColorToggle={onColorToggle}
          maxColors={5}
        />

        {/* Weather Suitable */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weather Suitable</Text>
          <TextInput
            style={styles.input}
            value={weatherSuitable}
            onChangeText={onWeatherSuitableChange}
            placeholder="e.g. Hot, Cold, Rainy..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Condition */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condition</Text>
          <TextInput
            style={styles.input}
            value={condition}
            onChangeText={onConditionChange}
            placeholder="e.g. New, Good, Worn..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Pattern */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pattern</Text>
          <TextInput
            style={styles.input}
            value={pattern}
            onChangeText={onPatternChange}
            placeholder="e.g. Solid, Striped, Floral..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Fabric */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fabric</Text>
          <TextInput
            style={styles.input}
            value={fabric}
            onChangeText={onFabricChange}
            placeholder="e.g. Cotton, Silk, Polyester..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Styles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Styles </Text>
          <Text style={styles.helperText}>Select one or more styles that match this item</Text>
          {isMetadataLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading styles...</Text>
            </View>
          ) : (
            <View style={styles.chipGrid}>
              {stylesData.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.chip,
                    selectedStyles.includes(style.id) && styles.chipSelected,
                  ]}
                  onPress={() => onStyleToggle(style.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedStyles.includes(style.id) && styles.chipTextSelected,
                    ]}
                  >
                    {style.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Occasions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Occasions </Text>
          <Text style={styles.helperText}>Select occasions when you'd wear this</Text>
          {isMetadataLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading occasions...</Text>
            </View>
          ) : (
            <View style={styles.chipGrid}>
              {occasionsData.map((occasion) => (
                <TouchableOpacity
                  key={occasion.id}
                  style={[
                    styles.chip,
                    selectedOccasions.includes(occasion.id) && styles.chipSelected,
                  ]}
                  onPress={() => onOccasionToggle(occasion.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedOccasions.includes(occasion.id) && styles.chipTextSelected,
                    ]}
                  >
                    {occasion.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Seasons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seasons </Text>
          <Text style={styles.helperText}>Select suitable seasons for this item</Text>
          {isMetadataLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading seasons...</Text>
            </View>
          ) : (
            <View style={styles.chipGrid}>
              {seasonsData.map((season) => (
                <TouchableOpacity
                  key={season.id}
                  style={[
                    styles.chip,
                    selectedSeasons.includes(season.id) && styles.chipSelected,
                  ]}
                  onPress={() => onSeasonToggle(season.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSeasons.includes(season.id) && styles.chipTextSelected,
                    ]}
                  >
                    {season.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  todayButton: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
  clearButton: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
  },
  dateDisplay: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 4,
  },
  dateDisplayText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 12,
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  colorIndicator: {
    width: 16,
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
  // Modal styles for iOS DatePicker
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalButton: {
    fontSize: 16,
    color: "#6b7280",
  },
  modalButtonDone: {
    fontWeight: "600",
    color: "#3b82f6",
  },
  dateTimePicker: {
    height: 200,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
