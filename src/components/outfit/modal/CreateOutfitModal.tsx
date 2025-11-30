import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CreateOutfitRequest } from "../../../types/outfit";
import { Item } from "../../../types/item";
import { GetItems } from "../../../services/endpoint/wardorbe";
import { getUserId } from "../../../services/api/apiClient";

interface CreateOutfitModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateOutfit: (data: CreateOutfitRequest) => Promise<any>;
}

export const CreateOutfitModal: React.FC<CreateOutfitModalProps> = ({
  visible,
  onClose,
  onCreateOutfit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<{ name?: string; items?: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      fetchItems();
    } else {
      // Reset form when modal closes
      setName("");
      setDescription("");
      setSelectedItemIds([]);
      setSearchQuery("");
    }
  }, [visible]);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const userId = await getUserId();
      if (!userId) {
        return;
      }

      const response = await GetItems({
        pageIndex: 1,
        pageSize: 10,
        userId: parseInt(userId),
        takeAll: true,
      });

      if (response.statusCode === 200 && response.data?.data) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((prev) => {
      const newIds = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      
      // Clear error when items are selected
      if (newIds.length > 0 && errors.items) {
        setErrors((prev) => ({ ...prev, items: undefined }));
      }
      
      return newIds;
    });
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      // Deselect all
      setSelectedItemIds([]);
    } else {
      // Select all filtered items
      setSelectedItemIds(filteredItems.map((item) => item.id));
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Map<number, string>();
    items.forEach((item) => {
      if (!uniqueCategories.has(item.categoryId)) {
        uniqueCategories.set(item.categoryId, item.categoryName);
      }
    });
    return Array.from(uniqueCategories.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const handleCreate = async () => {
    if (loading) return;

    // Validation
    const newErrors: { name?: string; items?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Outfit name is required";
    }
    
    if (selectedItemIds.length === 0) {
      newErrors.items = "Please select at least one item";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data: CreateOutfitRequest = {
        name: name.trim(),
        itemIds: selectedItemIds,
      };
      
      if (description.trim()) {
        data.description = description.trim();
      }

      await onCreateOutfit(data);
      onClose();
    } catch (error) {
      console.error("Error creating outfit:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer} edges={["top"]}>
        <LinearGradient
          colors={["#1f2b88", "#0e133a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
            <View style={styles.headerContent}>
              <View style={styles.headerTextWrapper}>
                <Text style={styles.headerTitle}>Create New Outfit</Text>
                <Text style={styles.headerSubtitle}>
                  Add name, description, and select items
                </Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Name Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>
                Outfit Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter outfit name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Description Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter outfit description"
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Item Selection */}
            <View style={styles.inputSection}>
              <View style={styles.itemSelectionHeader}>
                <View>
                  <Text style={styles.label}>
                    Select Items <Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.subLabel}>
                    {selectedItemIds.length} of {filteredItems.length} items selected
                  </Text>
                </View>
                <View style={styles.itemSelectionActions}>
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setSelectedCategory(selectedCategory === null ? (categories[0]?.id ?? null) : null)}
                  >
                    <Ionicons name="filter" size={16} color="#64748b" />
                    <Text style={styles.filterButtonText}>
                      {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Filter"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
                    <Text style={styles.selectAllText}>
                      {selectedItemIds.length === filteredItems.length ? "Deselect All" : "Select All"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {errors.items && (
                <Text style={styles.errorText}>{errors.items}</Text>
              )}

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search items..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Category Filter */}
              {selectedCategory !== null && (
                <View style={styles.categoryFilterContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryChips}>
                      <TouchableOpacity
                        style={[styles.categoryChip, selectedCategory === null && styles.categoryChipActive]}
                        onPress={() => setSelectedCategory(null)}
                      >
                        <Text style={[styles.categoryChipText, selectedCategory === null && styles.categoryChipTextActive]}>
                          All
                        </Text>
                      </TouchableOpacity>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]}
                          onPress={() => setSelectedCategory(category.id)}
                        >
                          <Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Items Grid */}
              {loadingItems ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.loadingText}>Loading items...</Text>
                </View>
              ) : filteredItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="shirt-outline" size={48} color="#cbd5e1" />
                  <Text style={styles.emptyText}>
                    {searchQuery ? "No items found" : "No items available"}
                  </Text>
                </View>
              ) : (
                <View style={styles.itemsGrid}>
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.itemCard,
                          isSelected && styles.itemCardSelected,
                        ]}
                        onPress={() => toggleItemSelection(item.id)}
                      >
                        <View style={styles.itemImageContainer}>
                          {item.imgUrl ? (
                            <Image
                              source={{ uri: item.imgUrl }}
                              style={styles.itemImage}
                            />
                          ) : (
                            <View style={styles.itemImagePlaceholder}>
                              <Ionicons
                                name="shirt-outline"
                                size={24}
                                color="#94a3b8"
                              />
                            </View>
                          )}
                          {isSelected && (
                            <View style={styles.selectedBadge}>
                              <Ionicons name="checkmark" size={14} color="#fff" />
                            </View>
                          )}
                        </View>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.itemCategory} numberOfLines={1}>
                          {item.categoryName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={18} color="#fff" />
                  <Text style={styles.createButtonText}>Create Outfit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "rgba(226, 232, 240, 0.9)",
    fontSize: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  inputSection: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  subLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  required: {
    color: "#ef4444",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  itemCard: {
    width: "30%",
    aspectRatio: 0.75,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    padding: 8,
    gap: 6,
  },
  itemCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  itemImageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },
  itemCategory: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
  createButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  itemSelectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemSelectionActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  selectAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
  categoryFilterContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  categoryChips: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
});

