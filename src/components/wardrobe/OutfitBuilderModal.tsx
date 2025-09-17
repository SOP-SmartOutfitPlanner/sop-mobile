import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WardrobeItem } from "../../types";
import { mockWardrobeItems } from "../../hooks/mockData";

interface OutfitBuilderModalProps {
  visible: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
}

export const OutfitBuilderModal: React.FC<OutfitBuilderModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  const [selectedItems, setSelectedItems] = useState<WardrobeItem[]>([]);
  const [outfitName, setOutfitName] = useState("");

  React.useEffect(() => {
    if (item) {
      setSelectedItems([item]);
    }
  }, [item]);

  const toggleItemSelection = (targetItem: WardrobeItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.id === targetItem.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== targetItem.id);
      } else {
        return [...prev, targetItem];
      }
    });
  };

  const saveOutfit = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please select at least one item for your outfit");
      return;
    }

    Alert.alert("Success", "Outfit saved successfully!", [
      { text: "OK", onPress: onClose },
    ]);
  };

  const getItemsByCategory = () => {
    const categories = [
      "top",
      "bottom",
      "dress",
      "jacket",
      "shoes",
      "accessory",
    ];
    return categories
      .map((category) => ({
        category,
        items: mockWardrobeItems.filter((i) => i.type === category),
      }))
      .filter((group) => group.items.length > 0);
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
          <Text style={styles.headerTitle}>Build Outfit</Text>
          <TouchableOpacity onPress={saveOutfit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Items Preview */}
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>
            Your Outfit ({selectedItems.length} items)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectedScroll}
          >
            {selectedItems.map((selectedItem, index) => (
              <View key={selectedItem.id} style={styles.selectedItem}>
                <Image
                  source={{ uri: selectedItem.imageUrl }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => toggleItemSelection(selectedItem)}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            {selectedItems.length === 0 && (
              <View style={styles.emptyOutfit}>
                <Ionicons name="shirt-outline" size={32} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  Select items to build your outfit
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Items by Category */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {getItemsByCategory().map(({ category, items }) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.itemsRow}>
                  {items.map((wardrobeItem) => {
                    const isSelected = selectedItems.some(
                      (i) => i.id === wardrobeItem.id
                    );
                    return (
                      <TouchableOpacity
                        key={wardrobeItem.id}
                        style={[
                          styles.itemCard,
                          isSelected && styles.itemCardSelected,
                        ]}
                        onPress={() => toggleItemSelection(wardrobeItem)}
                      >
                        <Image
                          source={{ uri: wardrobeItem.imageUrl }}
                          style={styles.itemImage}
                        />
                        <Text style={styles.itemName} numberOfLines={2}>
                          {wardrobeItem.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        {/* Outfit Actions */}
        <View style={styles.actionSection}>
          <View style={styles.outfitStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Items</Text>
              <Text style={styles.statValue}>{selectedItems.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Value</Text>
              <Text style={styles.statValue}>
                $
                {selectedItems
                  .reduce((sum, item) => sum + item.price, 0)
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
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
  selectedSection: {
    backgroundColor: "#f9fafb",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  selectedScroll: {
    paddingHorizontal: 16,
  },
  selectedItem: {
    marginRight: 12,
    position: "relative",
  },
  selectedImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  emptyOutfit: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginVertical: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  itemsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  itemCard: {
    width: 100,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  itemCardSelected: {
    borderColor: "#3b82f6",
  },
  itemImage: {
    width: "100%",
    height: 120,
  },
  itemName: {
    fontSize: 12,
    color: "#1f2937",
    padding: 8,
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  outfitStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
});
