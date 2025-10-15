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
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateDisplay, getCurrentISODate } from "../../../utils/dateUtils";
import type { Category } from "../../../types/category";

interface ItemDetailsStepProps {
  itemName: string;
  brand: string;
  categoryId: number;
  color: string;
  aiDescription: string;
  weatherSuitable: string;
  condition: string;
  pattern: string;
  fabric: string;
  lastWornAt: string;
  frequencyWorn: string;
  categories: Category[];
  isCategoriesLoading: boolean;
  onItemNameChange: (text: string) => void;
  onBrandChange: (text: string) => void;
  onCategorySelect: (categoryId: number, categoryName: string) => void;
  onColorChange: (text: string) => void;
  onAiDescriptionChange: (text: string) => void;
  onWeatherSuitableChange: (text: string) => void;
  onConditionChange: (text: string) => void;
  onPatternChange: (text: string) => void;
  onFabricChange: (text: string) => void;
  onLastWornAtChange: (text: string) => void;
  onFrequencyWornChange: (text: string) => void;
}

export const ItemDetailsStep: React.FC<ItemDetailsStepProps> = ({
  itemName,
  brand,
  categoryId,
  color,
  aiDescription,
  weatherSuitable,
  condition,
  pattern,
  fabric,
  lastWornAt,
  frequencyWorn,
  categories,
  isCategoriesLoading,
  onItemNameChange,
  onBrandChange,
  onCategorySelect,
  onColorChange,
  onAiDescriptionChange,
  onWeatherSuitableChange,
  onConditionChange,
  onPatternChange,
  onFabricChange,
  onLastWornAtChange,
  onFrequencyWornChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const frequencyWornInputRef = React.useRef<TextInput>(null);

  // Helper function to scroll to bottom when keyboard appears
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        // Android: close picker and update only on confirmation
        setShowDatePicker(false);
        if (event.type === "set" && selectedDate) {
          onLastWornAtChange(selectedDate.toISOString());
        }
      } else {
        // iOS: real-time update as user scrolls
        if (selectedDate) {
          onLastWornAtChange(selectedDate.toISOString());
        }
      }
    },
    [onLastWornAtChange]
  );

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
          <Text style={styles.label}>Brand (Optional)</Text>
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
          {isCategoriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading categories...</Text>
            </View>
          ) : (
            <View style={styles.typeGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.typeChip,
                    categoryId === category.id && styles.typeChipSelected,
                  ]}
                  onPress={() => onCategorySelect(category.id, category.name)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      categoryId === category.id && styles.typeChipTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={onColorChange}
            placeholder="e.g. Red, Blue, White..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* AI Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={aiDescription}
            onChangeText={onAiDescriptionChange}
            placeholder="Auto-filled by AI or enter manually"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>

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

        {/* Last Worn At */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Last Worn Date</Text>
            <View style={styles.dateButtonsRow}>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => onLastWornAtChange(getCurrentISODate())}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => onLastWornAtChange("")}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dateDisplay}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateDisplayText}>
              {lastWornAt
                ? formatDateDisplay(lastWornAt)
                : "Tap to select date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && Platform.OS === "ios" && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={styles.modalButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Select Date</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(false);
                      }}
                    >
                      <Text
                        style={[styles.modalButton, styles.modalButtonDone]}
                      >
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={lastWornAt ? new Date(lastWornAt) : new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    style={styles.dateTimePicker}
                  />
                </View>
              </View>
            </Modal>
          )}

          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={lastWornAt ? new Date(lastWornAt) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.helperText}>
            Tap the date area to select, or use "Today"/"Clear" buttons
          </Text>
        </View>

        {/* Frequency Worn */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency Worn</Text>
          <TextInput
            ref={frequencyWornInputRef}
            style={styles.input}
            value={frequencyWorn}
            onChangeText={onFrequencyWornChange}
            placeholder="e.g. Daily, Weekly, Monthly, Rarely..."
            placeholderTextColor="#9ca3af"
            onFocus={scrollToBottom}
            returnKeyType="done"
            blurOnSubmit={true}
          />
          <Text style={styles.helperText}>
            How often do you wear this item?
          </Text>
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
});
