import React, { useState } from "react";
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

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
}) => {
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const itemTypes = ["top", "bottom", "dress", "jacket", "shoes", "accessory"];
  const colors = ["black", "white", "grey", "navy", "blue", "red", "green"];

  const handleSave = () => {
    if (!itemName.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    // Here you would normally save the item
    Alert.alert("Success", "Item added successfully!", [
      { text: "OK", onPress: onClose },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photo Section */}
          <TouchableOpacity style={styles.photoSection}>
            <Ionicons name="camera" size={32} color="#6b7280" />
            <Text style={styles.photoText}>Add Photo</Text>
          </TouchableOpacity>

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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.chipContainer}>
              {itemTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    selectedType === type && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedType === type && styles.chipTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.chipContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.chip,
                    selectedColor === color && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <View style={styles.colorChipContent}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        selectedColor === color && styles.chipTextSelected,
                      ]}
                    >
                      {color}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  photoSection: {
    height: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  photoText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: "#fff",
  },
  colorChipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
