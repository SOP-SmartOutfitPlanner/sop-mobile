import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useImagePicker } from "../../hooks/useImagePicker";
import { PhotoSection } from "./uploadImage/PhotoSection";
import { ChipSelector } from "./ChipSelector";
import { ColorChip } from "./ColorChip";
import { ITEM_TYPES, COLORS, ALERT_MESSAGES } from "../../constants/wardrobe";
import { NewWardrobeItem } from "../../types";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (item: NewWardrobeItem) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // Form state
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Image picker hook
  const { selectedImage, isLoading, showImagePicker, resetImage } =
    useImagePicker();

  const resetForm = useCallback(() => {
    setItemName("");
    setBrand("");
    setPrice("");
    setSelectedType("");
    setSelectedColor("");
    resetImage();
  }, [resetImage]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const validateForm = (): boolean => {
    if (!itemName.trim()) {
      Alert.alert(
        ALERT_MESSAGES.ERROR_NAME_REQUIRED.title,
        ALERT_MESSAGES.ERROR_NAME_REQUIRED.message
      );
      return false;
    }
    return true;
  };

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    const itemData: NewWardrobeItem = {
      name: itemName.trim(),
      brand: brand.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      type: selectedType,
      color: selectedColor,
      imageUri: selectedImage,
    };

    if (onSave) {
      onSave(itemData);
    } else {
      console.log("Saving item:", itemData);
    }

    Alert.alert(
      ALERT_MESSAGES.SUCCESS_SAVE.title,
      ALERT_MESSAGES.SUCCESS_SAVE.message,
      [{ text: "OK", onPress: handleClose }]
    );
  }, [
    itemName,
    brand,
    price,
    selectedType,
    selectedColor,
    selectedImage,
    onSave,
    handleClose,
  ]);

  const renderColorChip = (color: string, isSelected: boolean) => (
    <ColorChip color={color} isSelected={isSelected} />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photo Section */}
          <PhotoSection
            selectedImage={selectedImage}
            isLoading={isLoading}
            onPress={showImagePicker}
          />

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g. Blue Denim Jacket"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brand</Text>
              <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Levi's"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Type Selection */}
          <ChipSelector
            title="Type"
            options={ITEM_TYPES}
            selectedValue={selectedType}
            onSelect={setSelectedType}
          />

          {/* Color Selection */}
          <ChipSelector
            title="Color"
            options={COLORS}
            selectedValue={selectedColor}
            onSelect={setSelectedColor}
            renderOption={renderColorChip}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
});
