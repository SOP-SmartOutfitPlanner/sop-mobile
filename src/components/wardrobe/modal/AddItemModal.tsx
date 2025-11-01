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
import { useImagePicker } from "../../../hooks/useImagePicker";
import { StepIndicator } from "../wizard/StepIndicator";
import { UploadPhotoStep } from "../wizard/UploadPhotoStep";
import { ItemDetailsStep } from "../wizard/ItemDetailsStep";
import { ReviewStep } from "../wizard/ReviewStep";
import { ALERT_MESSAGES } from "../../../constants/wardrobe";
import { AddItem, SummaryItem } from "../../../services/endpoint/wardorbe";
import { prepareFileForUpload } from "../../../utils/imageUtils";
import type { AddItemRequest } from "../../../types/item";
import { getUserId } from "../../../services/api/apiClient";
import { AILoadingOutfit } from "../../loading/AILoadingOutfit";
import NotificationModal from "../../notification/NotificationModal";
import { useNotification } from "../../../hooks/useNotification";
import { useCategories } from "../../../hooks/useCategories";
import { useItemMetadata } from "../../../hooks/useItemMetadata";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

// Constants
const STEPS = [
  { id: 1, title: "Upload", subtitle: "& Detect" },
  { id: 2, title: "Item", subtitle: "Details" },
  { id: 3, title: "Review", subtitle: "& Save" },
];

const GRADIENT_COLORS = {
  primary: ["#30cfd0", "#330867"],
  disabled: ["#9ca3af", "#9ca3af"],
} as const;

// Helper functions
const buildRequestData = (
  userId: number,
  formData: {
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
    imageRemBgURL: string;
    lastWornAt: string;
    frequencyWorn: string;
    styleIds: number[];
    occasionIds: number[];
    seasonIds: number[];
  }
): Partial<AddItemRequest> => {
  const {
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
    imageRemBgURL,
    lastWornAt,
    frequencyWorn,
    styleIds,
    occasionIds,
    seasonIds,
  } = formData;

  // Build tag from available fields
  const tagParts = [categoryName, color, weatherSuitable, condition, pattern, fabric].filter(Boolean);

  // Start with required fields
  const requestData: any = {
    userId,
    name: itemName.trim(),
    categoryId,
    categoryName,
    imgUrl: imageRemBgURL,
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
  if (tagParts.length > 0) requestData.tag = tagParts.join(", ");

  return requestData;
};

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Form state - Match API request
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
  const [imageRemBgURL, setImageRemBgURL] = useState("");
  const [lastWornAt, setLastWornAt] = useState("");
  const [frequencyWorn, setFrequencyWorn] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<number[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<number[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);

  // Loading states
  const [isDetecting, setIsDetecting] = useState(false);
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
    selectedImage,
    isLoading,
    pickImageFromCamera,
    pickImageFromLibrary,
    resetImage,
  } = useImagePicker();
  const { styles: stylesList, occasions: occasionsList, seasons: seasonsList } = useItemMetadata();

  // Fetch parent categories on mount
  useEffect(() => {
    if (visible) {
      fetchParentCategories();
    }
  }, [visible, fetchParentCategories]);

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
    setImageRemBgURL("");
    setLastWornAt("");
    setFrequencyWorn("");
    setSelectedStyles([]);
    setSelectedOccasions([]);
    setSelectedSeasons([]);
    resetImage();
  }, [resetImage]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Handle Detect Image with AI
  const handleDetectImage = useCallback(async () => {
    if (!selectedImage) {
      notification.showError("Please upload an image first");
      return;
    }

    setIsDetecting(true);
    try {
      const fileObject = await prepareFileForUpload(selectedImage);
      console.log("📤 Uploading compressed image...");

      const response = await SummaryItem({ file: fileObject });

      if (response.statusCode === 200 && response.data) {
        const { data } = response;
        
        // Set item name from AI
        if (data.name) {
          setItemName(data.name);
        }
        
        // Handle colors array - join multiple colors or use first color
        if (data.colors && data.colors.length > 0) {
          const colorNames = data.colors.map(c => c.name).join(", ");
          setColor(colorNames);
        }
        
        // Set category from AI
        if (data.category) {
          setCategoryId(data.category.id);
          setCategoryName(data.category.name);
        }
        
        // Set other fields
        setAiDescription(data.aiDescription || "");
        setWeatherSuitable(data.weatherSuitable || "");
        setCondition(data.condition || "");
        setPattern(data.pattern || "");
        setFabric(data.fabric || "");
        setImageRemBgURL(data.imageRemBgURL || "");

        // Set styles, occasions, and seasons from AI
        if (data.styles && data.styles.length > 0) {
          setSelectedStyles(data.styles.map(s => s.id));
        }
        if (data.occasions && data.occasions.length > 0) {
          setSelectedOccasions(data.occasions.map(o => o.id));
        }
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeasons(data.seasons.map(s => s.id));
        }

        notification.showSuccess(
          "Image analyzed successfully! Form auto-filled with AI data.",
          "Success"
        );
      }
    } catch (error: any) {
      console.error("AI Detection Error:", error);

      if (error.response?.status === 413) {
        notification.showError(
          "The image is still too large. Please try with a smaller image or different photo.",
          "Image Too Large"
        );
      } else {
        notification.showError(
          error.response?.data?.message || "Failed to analyze image. Please try again.",
          "Detection Failed"
        );
      }
    } finally {
      setIsDetecting(false);
    }
  }, [selectedImage, notification]);

  // Step validation
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!selectedImage && !!imageRemBgURL;
      case 3:
        return !!itemName.trim() && categoryId > 0;
      default:
        return true;
    }
  };

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Get userId
      const userId = await getUserId();
      if (!userId) {
        notification.showError("User not authenticated. Please login again.");
        return;
      }

      // Validate required fields
      if (!itemName.trim()) {
        notification.showError("Item name is required", "Validation Error");
        return;
      }

      if (!categoryId || categoryId === 0) {
        notification.showError("Please select a category", "Validation Error");
        return;
      }

      if (!imageRemBgURL?.trim()) {
        notification.showError(
          "Image URL is missing. Please detect image with AI first.",
          "Validation Error"
        );
        return;
      }

      // Build request data
      const requestData = buildRequestData(parseInt(userId, 10), {
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
        imageRemBgURL,
        lastWornAt,
        frequencyWorn,
        styleIds: selectedStyles,
        occasionIds: selectedOccasions,
        seasonIds: selectedSeasons,
      });

      console.log("=== Final Request Data ===");
      console.log(JSON.stringify(requestData, null, 2));

      // Call API
      const response = await AddItem(requestData as AddItemRequest);

      if (response.statusCode === 200) {
        notification.showSuccess(
          ALERT_MESSAGES.SUCCESS_SAVE.message,
          ALERT_MESSAGES.SUCCESS_SAVE.title,
          () => {
            handleClose();
            onSave?.();
          }
        );
      }
    } catch (error: any) {
      console.error("Error saving item:", error);
      notification.showError(
        error.response?.data?.message || "Failed to save item. Please try again.",
        "Save Failed"
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
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
    imageRemBgURL,
    lastWornAt,
    frequencyWorn,
    notification,
    handleClose,
    onSave,
  ]);

  // Handle category selection
  const handleCategorySelect = useCallback((id: number, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
  }, []);

  // Handle toggle selections
  const handleStyleToggle = useCallback((styleId: number) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  }, []);

  const handleOccasionToggle = useCallback((occasionId: number) => {
    setSelectedOccasions(prev => 
      prev.includes(occasionId) 
        ? prev.filter(id => id !== occasionId)
        : [...prev, occasionId]
    );
  }, []);

  const handleSeasonToggle = useCallback((seasonId: number) => {
    setSelectedSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  }, []);

  // Step validation - memoized
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!selectedImage && !!imageRemBgURL;
      case 2:
        return !!itemName.trim() && categoryId > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [currentStep, selectedImage, imageRemBgURL, itemName, categoryId]);

  // Validation messages
  const validationMessage = useMemo(() => {
    const messages: Record<number, string> = {
      1: "Please detect image with AI first",
      2: "Please fill in item name and category",
    };
    return messages[currentStep] || "";
  }, [currentStep]);

  // Step navigation handlers
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
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

  // Memoized step components
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <UploadPhotoStep
            selectedImage={selectedImage}
            isLoading={isLoading}
            isDetecting={isDetecting}
            onCameraPress={pickImageFromCamera}
            onGalleryPress={pickImageFromLibrary}
            onDetectPress={handleDetectImage}
          />
        );
      case 2:
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
            selectedStyles={selectedStyles}
            selectedOccasions={selectedOccasions}
            selectedSeasons={selectedSeasons}
            parentCategories={parentCategories}
            childCategories={childCategories}
            isCategoriesLoading={isCategoriesLoading}
            isLoadingChildren={isLoadingChildren}
            onItemNameChange={setItemName}
            onBrandChange={setBrand}
            onCategorySelect={handleCategorySelect}
            onFetchChildCategories={fetchChildCategories}
            onColorChange={setColor}
            onAiDescriptionChange={setAiDescription}
            onWeatherSuitableChange={setWeatherSuitable}
            onConditionChange={setCondition}
            onPatternChange={setPattern}
            onFabricChange={setFabric}
            onFrequencyWornChange={setFrequencyWorn}
            onLastWornAtChange={setLastWornAt}
            onStyleToggle={handleStyleToggle}
            onOccasionToggle={handleOccasionToggle}
            onSeasonToggle={handleSeasonToggle}
          />
        );
      case 3:
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
              imageUri: selectedImage,
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
    selectedImage,
    isLoading,
    isDetecting,
    pickImageFromCamera,
    pickImageFromLibrary,
    handleDetectImage,
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
    selectedStyles,
    selectedOccasions,
    selectedSeasons,
    stylesList,
    occasionsList,
    seasonsList,
    parentCategories,
    childCategories,
    isCategoriesLoading,
    isLoadingChildren,
    handleCategorySelect,
    handleStyleToggle,
    handleOccasionToggle,
    handleSeasonToggle,
    fetchChildCategories,
  ]);

  // Button colors - memoized
  const buttonColors = useMemo(() => {
    return (!canProceed || isSaving)
      ? GRADIENT_COLORS.disabled
      : GRADIENT_COLORS.primary;
  }, [canProceed, isSaving]);

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
            <Text style={styles.headerTitle}>Add New Item</Text>
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
                onPress={currentStep === 3 ? handleSave : handleNext}
                disabled={!canProceed || isSaving}
              >
                <LinearGradient
                  colors={buttonColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  {currentStep === 3 ? (
                    <>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.nextButtonText}>
                        {isSaving ? "Saving..." : "Save Item"}
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

          {/* AI Loading Overlay - Inside Modal */}
          <AILoadingOutfit
            visible={isDetecting}
            message="Analyzing your item with AI…"
          />
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
