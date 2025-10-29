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
import { useNotification } from "../../../hooks/useNotification";
import { useCategories } from "../../../hooks/useCategories";

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
  } = formData;

  // Build tag from available fields
  const tagParts = [categoryName, color, weatherSuitable, condition, pattern, fabric].filter(Boolean);

  // Build request with all fields
  const requestData: any = {
    userId,
    name: itemName.trim(),
    categoryId,
    categoryName,
    imgUrl: imageUrl,
    color: color.trim() || "",
    aiDescription: aiDescription.trim() || "",
    brand: brand.trim() || "",
    weatherSuitable: weatherSuitable.trim() || "",
    condition: condition.trim() || "",
    pattern: pattern.trim() || "",
    fabric: fabric.trim() || "",
    lastWornAt: lastWornAt.trim() || "",
    frequencyWorn: frequencyWorn.trim() || "",
    tag: tagParts.length > 0 ? tagParts.join(", ") : "",
  };

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

  // Loading states
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const notification = useNotification();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

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
    }
  }, [item, visible]);

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
    notification,
    handleClose,
    onSave,
    editItem,
  ]);

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
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
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
    categories,
    isCategoriesLoading,
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
