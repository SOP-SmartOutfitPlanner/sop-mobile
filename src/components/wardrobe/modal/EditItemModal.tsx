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
import { StepIndicator } from "../wizard/StepIndicator";
import { ItemDetailsStep } from "../wizard/ItemDetailsStep";
import { ReviewStep } from "../wizard/ReviewStep";
import type { Item, ItemEdit } from "../../../types/item";
import NotificationModal from "../../notification/NotificationModal";
import { useCategories } from "../../../hooks/useCategories";
import { useItemMetadata } from "../../../hooks/useItemMetadata";
import { useNotification } from "../../../hooks";

interface EditItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  item: Item | null;
  editItem: (id: number, data: Partial<ItemEdit>) => Promise<ItemEdit>;
}

// Constants
const STEPS = [
  { id: 1, title: "Item", subtitle: "Details" },
  { id: 2, title: "Review", subtitle: "& Save" },
];

const GRADIENT_COLORS = {
  primary: ["#30cfd0", "#330867"],
  disabled: ["#9ca3af", "#9ca3af"],
} as const;

// Helper function
const buildEditRequestData = (
  itemId: number,
  formData: {
    userId: number;
    itemName: string;
    brand: string;
    categoryId: number;
    categoryName: string;
    color: string;
    aiDescription: string;
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
    categoryName,
    color,
    aiDescription,
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
    categoryName,
    imgUrl: imageUrl,
    styleIds: styleIds || [],
    occasionIds: occasionIds || [],
    seasonIds: seasonIds || [],
  };

  // Add optional fields only if they have actual values
  if (color?.trim()) requestData.color = color.trim();
  if (aiDescription?.trim()) requestData.aiDescription = aiDescription.trim();
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
  // Step navigation (only 2 steps for edit)
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [color, setColor] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [weatherSuitable, setWeatherSuitable] = useState("");
  const [condition, setCondition] = useState("");
  const [pattern, setPattern] = useState("");
  const [fabric, setFabric] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lastWornAt, setLastWornAt] = useState("");
  const [frequencyWorn, setFrequencyWorn] = useState("");
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
  const { styles: stylesList, occasions: occasionsList, seasons: seasonsList } = useItemMetadata();

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
      setColor(item.color || "");
      setAiDescription(item.aiDescription || "");
      setWeatherSuitable(item.weatherSuitable || "");
      setCondition(item.condition || "");
      setPattern(item.pattern || "");
      setFabric(item.fabric || "");
      setImageUrl(item.imgUrl || "");
      setLastWornAt(item.lastWornAt || "");
      setFrequencyWorn(item.frequencyWorn || "");
      setSelectedStyles(item.styles?.map(s => s.id) || []);
      setSelectedOccasions(item.occasions?.map(o => o.id) || []);
      setSelectedSeasons(item.seasons?.map(s => s.id) || []);
    }
  }, [item, visible]);

  // Auto-fetch child categories when parent categories are loaded and item has a category
  useEffect(() => {
    const autoFetchChildCategories = async () => {
      if (item && visible && parentCategories.length > 0 && item.categoryId) {
        // Try to find if the categoryId belongs to a parent category
        const parentCategory = parentCategories.find(cat => cat.id === item.categoryId);
        
        if (parentCategory) {
          // This is a parent category, fetch its children
          console.log('📂 Auto-fetching child categories for parent:', item.categoryId);
          await fetchChildCategories(item.categoryId);
        } else {
          // This might be a child category, find its parent
          // We need to fetch all child categories to find the parent
          for (const parent of parentCategories) {
            const children = await fetchChildCategories(parent.id);
            const childCategory = children.find(child => child.id === item.categoryId);
            
            if (childCategory) {
              console.log('📂 Found child category, parent is:', parent.id);
              break; // We found the parent, no need to continue
            }
          }
        }
      }
    };

    autoFetchChildCategories();
  }, [item, visible, parentCategories, fetchChildCategories]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setItemName("");
    setBrand("");
    setCategoryId(0);
    setCategoryName("");
    setColor("");
    setAiDescription("");
    setWeatherSuitable("");
    setCondition("");
    setPattern("");
    setFabric("");
    setImageUrl("");
    setLastWornAt("");
    setFrequencyWorn("");
    setSelectedStyles([]);
    setSelectedOccasions([]);
    setSelectedSeasons([]);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Handle category selection
  const handleCategorySelect = useCallback((id: number, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
  }, []);

  // Step validation - memoized
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!itemName.trim() && categoryId > 0;
      case 2:
        return true;
      default:
        return false;
    }
  }, [currentStep, itemName, categoryId]);

  // Validation messages
  const validationMessage = useMemo(() => {
    const messages: Record<number, string> = {
      1: "Please fill in item name and category",
    };
    return messages[currentStep] || "";
  }, [currentStep]);

  // Step navigation handlers
  const handleNext = useCallback(() => {
    if (currentStep < 2) {
      if (canProceed) {
        setCurrentStep(currentStep + 1);
      } else {
        notification.showWarning(validationMessage, "Required Fields");
      }
    }
  }, [currentStep, canProceed, validationMessage, notification]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSave = useCallback(async () => {
    if (isSaving || !item) return;

    setIsSaving(true);
    try {
      // Validate required fields
      if (!itemName.trim()) {
        notification.showError("Item name is required", "Validation Error");
        return;
      }

      if (!categoryId || categoryId === 0) {
        notification.showError("Please select a category", "Validation Error");
        return;
      }

      // Build request data
      const requestData = buildEditRequestData(item.id, {
        userId: item.userId,
        itemName,
        brand,
        categoryId,
        categoryName,
        color,
        aiDescription,
        weatherSuitable,
        condition,
        pattern,
        fabric,
        imageUrl,
        lastWornAt,
        frequencyWorn,
        styleIds: selectedStyles,
        occasionIds: selectedOccasions,
        seasonIds: selectedSeasons,
      });

    //   console.log("=== Edit Request Data ===");
    //   console.log(JSON.stringify(requestData, null, 2));

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
    itemName,
    brand,
    categoryId,
    categoryName,
    color,
    aiDescription,
    weatherSuitable,
    condition,
    pattern,
    fabric,
    imageUrl,
    lastWornAt,
    frequencyWorn,
    selectedStyles,
    selectedOccasions,
    selectedSeasons,
    notification,
    handleClose,
    onSave,
    editItem,
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

  // Memoized step components
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <ItemDetailsStep
            itemName={itemName}
            brand={brand}
            categoryId={categoryId}
            color={color}
            aiDescription={aiDescription}
            weatherSuitable={weatherSuitable}
            condition={condition}
            pattern={pattern}
            fabric={fabric}
            lastWornAt={lastWornAt}
            frequencyWorn={frequencyWorn}
            parentCategories={parentCategories}
            childCategories={childCategories}
            isCategoriesLoading={isCategoriesLoading}
            isLoadingChildren={isLoadingChildren}
            onFetchChildCategories={fetchChildCategories}
            selectedStyles={selectedStyles}
            selectedOccasions={selectedOccasions}
            selectedSeasons={selectedSeasons}
            onStyleToggle={handleStyleToggle}
            onOccasionToggle={handleOccasionToggle}
            onSeasonToggle={handleSeasonToggle}
            onItemNameChange={setItemName}
            onBrandChange={setBrand}
            onCategorySelect={handleCategorySelect}
            onColorChange={setColor}
            onAiDescriptionChange={setAiDescription}
            onWeatherSuitableChange={setWeatherSuitable}
            onConditionChange={setCondition}
            onPatternChange={setPattern}
            onFabricChange={setFabric}
            onFrequencyWornChange={setFrequencyWorn}
            onLastWornAtChange={setLastWornAt}
          />
        );
      case 2:
        return (
          <ReviewStep
            data={{
              name: itemName,
              brand,
              type: categoryName,
              color,
              aiDescription,
              weatherSuitable,
              condition,
              pattern,
              fabric,
              lastWornAt,
              frequencyWorn,
              imageUri: imageUrl,
              styles: selectedStyles
                .map((id) => stylesList.find((s) => s.id === id)?.name)
                .filter((name): name is string => !!name),
              occasions: selectedOccasions
                .map((id) => occasionsList.find((o) => o.id === id)?.name)
                .filter((name): name is string => !!name),
              seasons: selectedSeasons
                .map((id) => seasonsList.find((s) => s.id === id)?.name)
                .filter((name): name is string => !!name),
            }}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    itemName,
    brand,
    categoryId,
    categoryName,
    color,
    aiDescription,
    weatherSuitable,
    condition,
    pattern,
    fabric,
    lastWornAt,
    frequencyWorn,
    imageUrl,
    parentCategories,
    childCategories,
    isCategoriesLoading,
    isLoadingChildren,
    fetchChildCategories,
    selectedStyles,
    selectedOccasions,
    selectedSeasons,
    stylesList,
    occasionsList,
    seasonsList,
    handleStyleToggle,
    handleOccasionToggle,
    handleSeasonToggle,
    handleCategorySelect,
  ]);

  // Button colors - memoized
  const buttonColors = useMemo(() => {
    return (!canProceed || isSaving)
      ? GRADIENT_COLORS.disabled
      : GRADIENT_COLORS.primary;
  }, [canProceed, isSaving]);

  if (!item) return null;

  return (
    <>
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
            <Text style={styles.headerTitle}>Edit Item</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Step Indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          {/* Step Content */}
          <View style={styles.stepContent}>{stepContent}</View>

          {/* Step Footer */}
          <View style={styles.stepFooter}>
            <Text style={styles.stepText}>
              Step {currentStep} of {STEPS.length}
            </Text>

            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="chevron-back" size={20} color="#6b7280" />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.nextButtonWrapper}
                onPress={currentStep === 2 ? handleSave : handleNext}
                disabled={!canProceed || isSaving}
              >
                <LinearGradient
                  colors={buttonColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  {currentStep === 2 ? (
                    <>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.nextButtonText}>
                        {isSaving ? "Updating..." : "Update Item"}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
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
  placeholder: {
    width: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepFooter: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  stepText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
  nextButtonWrapper: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
