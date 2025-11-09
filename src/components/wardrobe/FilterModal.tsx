import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategories, useItemMetadata } from "../../hooks";
import { Category } from "../../types/category";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategoryId?: number;
  selectedSeasonId?: number;
  selectedStyleId?: number;
  selectedOccasionId?: number;
  isAnalyzed?: boolean;
  onCategorySelect: (categoryId?: number) => void;
  onSeasonSelect: (seasonId?: number) => void;
  onStyleSelect: (styleId?: number) => void;
  onOccasionSelect: (occasionId?: number) => void;
  onAnalyzedToggle: (isAnalyzed?: boolean) => void;
  onClearFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategoryId,
  selectedSeasonId,
  selectedStyleId,
  selectedOccasionId,
  isAnalyzed,
  onCategorySelect,
  onSeasonSelect,
  onStyleSelect,
  onOccasionSelect,
  onAnalyzedToggle,
  onClearFilters,
}) => {
  const { parentCategories, fetchParentCategories, fetchChildCategories, isLoading: isCategoriesLoading } = useCategories();
  const { styles: stylesList, seasons: seasonsList, occasions: occasionsList, isLoading: isMetadataLoading } = useItemMetadata();
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>();
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  // Cache for child categories to avoid re-fetching
  const [categoryCache, setCategoryCache] = useState<Record<number, Category[]>>({});

  // Fetch parent categories on mount
  useEffect(() => {
    if (visible) {
      fetchParentCategories();
    }
  }, [visible, fetchParentCategories]);

  // Fetch child categories when a parent is selected (with caching)
  useEffect(() => {
    const loadChildren = async () => {
      if (selectedParentId && visible) {
        // Check cache first
        if (categoryCache[selectedParentId]) {
          setChildCategories(categoryCache[selectedParentId]);
          return;
        }

        setIsLoadingChildren(true);
        try {
          const children = await fetchChildCategories(selectedParentId);
          setChildCategories(children);
          // Cache the result
          setCategoryCache(prev => ({
            ...prev,
            [selectedParentId]: children
          }));
        } catch (error) {
          console.error("Error fetching child categories:", error);
          setChildCategories([]);
        } finally {
          setIsLoadingChildren(false);
        }
      } else {
        setChildCategories([]);
      }
    };

    loadChildren();
  }, [selectedParentId, visible, fetchChildCategories, categoryCache]);

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedParentId(undefined);
      setChildCategories([]);
    }
  }, [visible]);

  // Memoize active filters count
  const activeFiltersCount = useMemo(() => 
    [
      selectedCategoryId,
      selectedSeasonId,
      selectedStyleId,
      selectedOccasionId,
      isAnalyzed,
    ].filter((filter) => filter !== undefined).length,
    [selectedCategoryId, selectedSeasonId, selectedStyleId, selectedOccasionId, isAnalyzed]
  );

  // Memoize handlers
  const handleParentToggle = useCallback((parentId: number) => {
    setSelectedParentId(prev => prev === parentId ? undefined : parentId);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedParentId(undefined);
    setChildCategories([]);
    onClearFilters();
  }, [onClearFilters]);

  // Memoize filter section renderer
  const renderFilterSection = useCallback((
    title: string,
    items: Array<{ id: number; name: string }>,
    selectedId: number | undefined,
    onSelect: (id?: number) => void,
    isLoading: boolean = false
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="#3b82f6" />
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>No items available</Text>
      ) : (
        <View style={styles.filterGrid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterChip,
                selectedId === item.id && styles.filterChipSelected,
              ]}
              onPress={() => onSelect(selectedId === item.id ? undefined : item.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedId === item.id && styles.filterChipTextSelected,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  ), []);

  // Memoize analyzed filter renderer
  const renderAnalyzedFilter = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Analysis Status</Text>
      <View style={styles.filterGrid}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            isAnalyzed === true && styles.filterChipSelected,
          ]}
          onPress={() => onAnalyzedToggle(isAnalyzed === true ? undefined : true)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={16} 
            color={isAnalyzed === true ? "#fff" : "#10b981"} 
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.filterChipText,
              isAnalyzed === true && styles.filterChipTextSelected,
            ]}
          >
            Analyzed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            isAnalyzed === false && styles.filterChipSelected,
          ]}
          onPress={() => onAnalyzedToggle(isAnalyzed === false ? undefined : false)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="alert-circle" 
            size={16} 
            color={isAnalyzed === false ? "#fff" : "#f59e0b"} 
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.filterChipText,
              isAnalyzed === false && styles.filterChipTextSelected,
            ]}
          >
            Not Analyzed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [isAnalyzed, onAnalyzedToggle]);

  // Memoize categories section renderer
  const renderCategoriesSection = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categories</Text>
      
      {/* Parent Categories */}
      <View style={styles.filterGrid}>
        {isCategoriesLoading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : parentCategories.length === 0 ? (
          <Text style={styles.emptyText}>No categories available</Text>
        ) : (
          parentCategories.map((parent) => (
            <TouchableOpacity
              key={parent.id}
              style={[
                styles.filterChip,
                selectedParentId === parent.id && styles.filterChipActive,
              ]}
              onPress={() => handleParentToggle(parent.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedParentId === parent.id && styles.filterChipActiveText,
                ]}
              >
                {parent.name}
              </Text>
              <Ionicons 
                name={selectedParentId === parent.id ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={selectedParentId === parent.id ? "#1f2937" : "#6b7280"} 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Child Categories - Only show when parent is selected */}
      {selectedParentId && (
        <View style={styles.childCategoriesContainer}>
          {isLoadingChildren ? (
            <ActivityIndicator size="small" color="#3b82f6" style={{ marginTop: 8 }} />
          ) : childCategories.length === 0 ? (
            <Text style={styles.emptyText}>No items in this category</Text>
          ) : (
            <View style={styles.filterGrid}>
              {childCategories.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.filterChip,
                    styles.childFilterChip,
                    selectedCategoryId === child.id && styles.filterChipSelected,
                  ]}
                  onPress={() => onCategorySelect(selectedCategoryId === child.id ? undefined : child.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategoryId === child.id && styles.filterChipTextSelected,
                    ]}
                  >
                    {child.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  ), [
    isCategoriesLoading,
    parentCategories,
    selectedParentId,
    handleParentToggle,
    isLoadingChildren,
    childCategories,
    selectedCategoryId,
    onCategorySelect
  ]);

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
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          {renderCategoriesSection()}
          {renderFilterSection(
            "Seasons",
            seasonsList,
            selectedSeasonId,
            onSeasonSelect,
            isMetadataLoading
          )}
          {renderFilterSection(
            "Styles",
            stylesList,
            selectedStyleId,
            onStyleSelect,
            isMetadataLoading
          )}
          {renderFilterSection(
            "Occasions",
            occasionsList,
            selectedOccasionId,
            onOccasionSelect,
            isMetadataLoading
          )}
          {renderAnalyzedFilter()}
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>
              Apply Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Text>
          </TouchableOpacity>
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
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "500",
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
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipActive: {
    backgroundColor: "#f3f4f6",
    borderColor: "#3b82f6",
    borderWidth: 2,
  },
  filterChipActiveText: {
    color: "#1f2937",
    fontWeight: "600",
  },
  childFilterChip: {
    marginLeft: 8,
    backgroundColor: "#fafafa",
  },
  childCategoriesContainer: {
    marginTop: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
  },
  filterChipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  filterChipTextSelected: {
    color: "#fff",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
