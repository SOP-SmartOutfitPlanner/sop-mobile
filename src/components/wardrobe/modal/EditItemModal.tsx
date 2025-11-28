import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { Item, ItemEdit, ColorItem } from "../../../types/item";
import NotificationModal from "../../notification/NotificationModal";
import { useCategories } from "../../../hooks/useCategories";
import { useItemMetadata } from "../../../hooks/useItemMetadata";
import { useNotification } from "../../../hooks";
import { parseColors, toggleColor } from "../../../utils/colorUtils";
import { ItemDetailsStep } from "../wizard/ItemDetailsStep";

interface EditItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  item: Item | null;
  editItem: (id: number, data: Partial<ItemEdit>) => Promise<ItemEdit>;
}

// Constants
const GRADIENT_COLORS = {
  primary: ["#30cfd0", "#330867"],
  disabled: ["#9ca3af", "#9ca3af"],
} as const;

// Helper function - simplified (itemId not used)
const buildEditRequestData = (
  formData: {
    userId: number;
    itemName: string;
    brand: string;
    categoryId: number;
    colors: ColorItem[];
    weatherSuitable: string;
    condition: string;
    pattern: string;
    fabric: string;
    imageUrl: string;
    lastWornAt: string;
    frequencyWorn: string;
    styleIds: number[];
    occasionIds: number[];
    seasonIds: number[];
  }
): Partial<ItemEdit> => {
  const {
    userId,
    itemName,
    brand,
    categoryId,
    colors,
    weatherSuitable,
    condition,
    pattern,
    fabric,
    imageUrl,
    lastWornAt,
    frequencyWorn,
    styleIds,
    occasionIds,
    seasonIds,
  } = formData;

  // Build request with required fields
  const requestData: any = {
    userId,
    name: itemName.trim(),
    categoryId,
    colors: colors || [],
    imgUrl: imageUrl,
    styleIds: styleIds || [],
    occasionIds: occasionIds || [],
    seasonIds: seasonIds || [],
  };

  // Add optional fields only if they have values
  if (brand?.trim()) requestData.brand = brand.trim();
  if (weatherSuitable?.trim()) requestData.weatherSuitable = weatherSuitable.trim();
  if (condition?.trim()) requestData.condition = condition.trim();
  if (pattern?.trim()) requestData.pattern = pattern.trim();
  if (fabric?.trim()) requestData.fabric = fabric.trim();
  if (lastWornAt?.trim()) requestData.lastWornAt = lastWornAt.trim();
  if (frequencyWorn?.trim()) requestData.frequencyWorn = frequencyWorn.trim();

  return requestData;
};

export const EditItemModal: React.FC<EditItemModalProps> = ({
  visible,
  onClose,
  onSave,
  item,
  editItem,
}) => {
  // Form state
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<ColorItem[]>([]);
  const [weatherSuitable, setWeatherSuitable] = useState("");
  const [condition, setCondition] = useState("");
  const [pattern, setPattern] = useState("");
  const [fabric, setFabric] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<number[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<number[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const notification = useNotification();
  const { 
    parentCategories, 
    childCategories,
    isLoading: isCategoriesLoading,
    isLoadingChildren,
    fetchParentCategories,
    fetchChildCategories,
  } = useCategories();
  const {
    styles: stylesList,
    occasions: occasionsList,
    seasons: seasonsList,
    isLoading: isMetadataLoading,
  } = useItemMetadata();

  // Fetch parent categories on mount
  useEffect(() => {
    if (visible) {
      fetchParentCategories();
    }
  }, [visible, fetchParentCategories]);

  // Initialize form with item data
  useEffect(() => {
    if (item && visible) {
      setItemName(item.name || "");
      setBrand(item.brand || "");
      setCategoryId(item.categoryId || 0);
      setCategoryName(item.categoryName || "");
      setSelectedColors(parseColors(item.color));
      setWeatherSuitable(item.weatherSuitable || "");
      setCondition(item.condition || "");
      setPattern(item.pattern || "");
      setFabric(item.fabric || "");
      setImageUrl(item.imgUrl || "");
      setSelectedStyles(item.styles?.map(s => s.id) || []);
      setSelectedOccasions(item.occasions?.map(o => o.id) || []);
      setSelectedSeasons(item.seasons?.map(s => s.id) || []);
    }
  }, [item, visible]);

  // Auto-fetch child categories when item category is loaded - optimized
  useEffect(() => {
    const autoFetchChildCategories = async () => {
      if (
        !item?.categoryId ||
        !visible ||
        parentCategories.length === 0 ||
        selectedParentId
      ) {
        return;
      }

      const parentCategory = parentCategories.find(
        (cat) => cat.id === item.categoryId
      );

      if (parentCategory) {
        setSelectedParentId(parentCategory.id);
        await fetchChildCategories(parentCategory.id);
        return;
      }

      for (const parent of parentCategories) {
        const children = await fetchChildCategories(parent.id);
        if (children.some((child) => child.id === item.categoryId)) {
          setSelectedParentId(parent.id);
          break;
        }
      }
    };

    autoFetchChildCategories();
  }, [
    item?.categoryId,
    visible,
    parentCategories,
    selectedParentId,
    fetchChildCategories,
  ]);

  const resetForm = useCallback(() => {
    setItemName("");
    setBrand("");
    setCategoryId(0);
    setCategoryName("");
    setSelectedParentId(null);
    setSelectedColors([]);
    setWeatherSuitable("");
    setCondition("");
    setPattern("");
    setFabric("");
    setImageUrl("");
    setSelectedStyles([]);
    setSelectedOccasions([]);
    setSelectedSeasons([]);
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((id: number, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
  }, []);

  const handleParentSelect = useCallback((parentId: number) => {
    setSelectedParentId(parentId);
    setCategoryId(0);
    setCategoryName("");
  }, []);

  // Step validation - memoized
  // Validation helper - memoized
  const validateForm = useCallback(() => {
    if (!itemName.trim()) {
      notification.showError("Item name is required", "Validation Error");
      return false;
    }

    if (!categoryId || categoryId === 0) {
      notification.showError("Please select a category", "Validation Error");
      return false;
    }

    return true;
  }, [itemName, categoryId, notification]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSave = useCallback(async () => {
    if (isSaving || !item) return;

    // Validate before proceeding
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Build request data
      const requestData = buildEditRequestData({
        userId: item.userId,
        itemName,
        brand,
        categoryId,
        colors: selectedColors,
        weatherSuitable,
        condition,
        pattern,
        fabric,
        imageUrl,
        lastWornAt: item.lastWornAt || '',
        frequencyWorn: item.frequencyWorn || '',
        styleIds: selectedStyles,
        occasionIds: selectedOccasions,
        seasonIds: selectedSeasons,
      });

      // Call editItem from hook
      const response = await editItem(item.id, requestData);

      if (response) {
        notification.showSuccess(
          "Item updated successfully!",
          "Success",
          () => {
            handleClose();
            onSave?.();
          }
        );
      }
    } catch (error: any) {
      console.error("Error updating item:", error);
      notification.showError(
        error.response?.data?.message || "Failed to update item. Please try again.",
        "Update Failed"
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    item,
    validateForm,
    itemName,
    brand,
    categoryId,
    selectedColors,
    weatherSuitable,
    condition,
    pattern,
    fabric,
    imageUrl,
    selectedStyles,
    selectedOccasions,
    selectedSeasons,
    editItem,
    notification,
    handleClose,
    onSave,
  ]);

  // Toggle handlers for styles, occasions, and seasons
  const handleStyleToggle = useCallback((styleId: number) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  }, []);

  const handleOccasionToggle = useCallback((occasionId: number) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasionId)
        ? prev.filter((id) => id !== occasionId)
        : [...prev, occasionId]
    );
  }, []);

  const handleSeasonToggle = useCallback((seasonId: number) => {
    setSelectedSeasons((prev) =>
      prev.includes(seasonId)
        ? prev.filter((id) => id !== seasonId)
        : [...prev, seasonId]
    );
  }, []);

  const handleColorToggle = useCallback((color: ColorItem) => {
    setSelectedColors((prev) => toggleColor(prev, color));
  }, []);

  // Button colors - memoized
  const buttonColors = useMemo(() => {
    return isSaving ? GRADIENT_COLORS.disabled : GRADIENT_COLORS.primary;
  }, [isSaving]);

  if (!item) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullscreenContainer}>
          <LinearGradient
            colors={["rgba(59,130,246,0.35)", "rgba(147,51,234,0.25)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroCard}
          >
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Edit Item</Text>
                <Text style={styles.subtitle}>Update your wardrobe item details</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={22} color="#e5edff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.sheet}>
            <View style={styles.stepContent}>
              <ItemDetailsStep
                itemName={itemName}
                brand={brand}
                categoryId={categoryId}
                selectedColors={selectedColors}
                weatherSuitable={weatherSuitable}
                condition={condition}
                pattern={pattern}
                fabric={fabric}
                parentCategories={parentCategories}
                childCategories={childCategories}
                isCategoriesLoading={isCategoriesLoading}
                isLoadingChildren={isLoadingChildren}
                onFetchChildCategories={fetchChildCategories}
                selectedParentId={selectedParentId}
                onParentSelect={handleParentSelect}
                selectedStyles={selectedStyles}
                selectedOccasions={selectedOccasions}
                selectedSeasons={selectedSeasons}
                onStyleToggle={handleStyleToggle}
                onOccasionToggle={handleOccasionToggle}
                onSeasonToggle={handleSeasonToggle}
                onItemNameChange={setItemName}
                onBrandChange={setBrand}
                onCategorySelect={handleCategorySelect}
                onColorToggle={handleColorToggle}
                onWeatherSuitableChange={setWeatherSuitable}
                onConditionChange={setCondition}
                onPatternChange={setPattern}
                onFabricChange={setFabric}
                stylesData={stylesList}
                occasionsData={occasionsList}
                seasonsData={seasonsList}
                isMetadataLoading={isMetadataLoading}
              />
            </View>

            <View style={styles.stepFooter}>
              <View style={styles.footerRow}>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.nextButtonWrapper}
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    <LinearGradient
                      colors={buttonColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.nextButton}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.nextButtonText}>
                        {isSaving ? "Updating..." : "Save Changes"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <NotificationModal
        isVisible={notification.visible}
        type={notification.config.type}
        title={notification.config.title}
        message={notification.config.message}
        onClose={notification.hideNotification}
        confirmText={notification.config.confirmText}
        cancelText={notification.config.cancelText}
        onConfirm={notification.config.onConfirm}
        showCancel={notification.config.showCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#030617",
  },
  heroCard: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5f5",
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#050b1d",
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  stepContent: {
    flex: 1,
    marginTop: 12,
  },
  stepFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.25)",
    paddingTop: 16,
    marginTop: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dbeafe",
  },
  stepHint: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    backgroundColor: "rgba(148,163,184,0.15)",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5f5",
  },
  nextButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
