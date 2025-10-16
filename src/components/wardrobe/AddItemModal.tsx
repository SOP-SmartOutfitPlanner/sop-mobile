import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useImagePicker } from "../../hooks/useImagePicker";
import { StepIndicator } from "./wizard/StepIndicator";
import { UploadPhotoStep } from "./wizard/UploadPhotoStep";
import { ItemDetailsStep } from "./wizard/ItemDetailsStep";
import { ReviewStep } from "./wizard/ReviewStep";
import { ALERT_MESSAGES } from "../../constants/wardrobe";
import { AddItem, SummaryItem } from "../../services/endpoint/wardorbe";
import { GetCategory } from "../../services/endpoint/category";
import { prepareFileForUpload } from "../../utils/imageUtils";
import type { AddItemRequest } from "../../types/item";
import type { Category } from "../../types/category";
import { getUserId } from "../../services/api/apiClient";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const STEPS = [
  { id: 1, title: "Upload", subtitle: "& Detect" },
  { id: 2, title: "Item", subtitle: "Details" },
  { id: 3, title: "Review", subtitle: "& Save" },
];

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
  const [imageRemBgURL, setImageRemBgURL] = useState(""); // Store image URL from AI
  const [lastWornAt, setLastWornAt] = useState(""); // ISO date string
  const [frequencyWorn, setFrequencyWorn] = useState(""); // How often worn

  // Categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // Loading states
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load categories when modal opens
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await GetCategory({
        pageIndex: 1,
        pageSize: 100, // Get all categories
      });

      if (response.statusCode === 200 && response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to hardcoded categories on error
      setCategories([
        { id: 1, name: "Top" },
        { id: 2, name: "Bottom" },
        { id: 3, name: "Dress" },
        { id: 4, name: "Jacket" },
        { id: 5, name: "Shoes" },
        { id: 6, name: "Accessory" },
      ]);
    } finally {
      setIsCategoriesLoading(false);
    }
  }; // Image picker hook
  const {
    selectedImage,
    isLoading,
    pickImageFromCamera,
    pickImageFromLibrary,
    resetImage,
  } = useImagePicker();

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
    resetImage();
  }, [resetImage]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Handle Detect Image with AI
  const handleDetectImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please upload an image first");
      return;
    }

    setIsDetecting(true);
    try {
      const fileObject = await prepareFileForUpload(selectedImage);

      console.log("📤 Uploading compressed image...");

      // Call AI Summary API
      const response = await SummaryItem({ file: fileObject });

      if (response.statusCode === 200 && response.data) {
        // Auto-fill form with AI-detected data
        const { data } = response;
        setColor(data.color || "");
        setAiDescription(data.aiDescription || "");
        setWeatherSuitable(data.weatherSuitable || "");
        setCondition(data.condition || "");
        setPattern(data.pattern || "");
        setFabric(data.fabric || "");
        setImageRemBgURL(data.imageRemBgURL || "");

        Alert.alert(
          "Success",
          "Image analyzed successfully! Form auto-filled with AI data.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      console.error("AI Detection Error:", error);

      // Check if it's a 413 error
      if (error.response?.status === 413) {
        Alert.alert(
          "Image Too Large",
          "The image is still too large. Please try with a smaller image or different photo."
        );
      } else {
        Alert.alert(
          "Detection Failed",
          error.response?.data?.message ||
            "Failed to analyze image. Please try again."
        );
      }
    } finally {
      setIsDetecting(false);
    }
  };

  // Step validation
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!selectedImage && !!imageRemBgURL; // Must detect image first
      case 3:
        return !!itemName.trim() && categoryId > 0;
      default:
        return true;
    }
  };

  // Validation messages
  const getValidationMessage = (step: number): string => {
    const messages = {
      1: "Please detect image with AI first",
      2: "Please fill in item name and category",
    };
    return messages[step as keyof typeof messages] || "";
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (canProceedToStep(currentStep + 1)) {
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert("Required Fields", getValidationMessage(currentStep));
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Get userId from AsyncStorage
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User not authenticated. Please login again.");
        setIsSaving(false);
        return;
      }

      // Validate all required fields
      if (!itemName.trim()) {
        Alert.alert("Validation Error", "Item name is required");
        setIsSaving(false);
        return;
      }

      if (!categoryId || categoryId === 0) {
        Alert.alert("Validation Error", "Please select a category");
        setIsSaving(false);
        return;
      }

      if (!imageRemBgURL || !imageRemBgURL.trim()) {
        Alert.alert(
          "Validation Error",
          "Image URL is missing. Please detect image with AI first."
        );
        setIsSaving(false);
        return;
      }

      // Prepare API request
      // Create tag from available fields
      const tagParts = [
        categoryName,
        color,
        weatherSuitable,
        condition,
        pattern,
        fabric,
      ].filter(Boolean);

      // Build request - start with required fields only
      const requestData: any = {
        userId: parseInt(userId, 10),
        name: itemName.trim(),
        categoryId: categoryId,
        categoryName: categoryName,
        imgUrl: imageRemBgURL, // Required - from AI
      };

      // Add optional fields ONLY if they have actual values
      if (color && color.trim()) {
        requestData.color = color.trim();
      }
      if (aiDescription && aiDescription.trim()) {
        requestData.aiDescription = aiDescription.trim();
      }
      if (brand && brand.trim()) {
        requestData.brand = brand.trim();
      }
      if (weatherSuitable && weatherSuitable.trim()) {
        requestData.weatherSuitable = weatherSuitable.trim();
      }
      if (condition && condition.trim()) {
        requestData.condition = condition.trim();
      }
      if (pattern && pattern.trim()) {
        requestData.pattern = pattern.trim();
      }
      if (fabric && fabric.trim()) {
        requestData.fabric = fabric.trim();
      }
      if (lastWornAt && lastWornAt.trim()) {
        requestData.lastWornAt = lastWornAt.trim();
      }
      if (frequencyWorn && frequencyWorn.trim()) {
        requestData.frequencyWorn = frequencyWorn.trim();
      }
      if (tagParts.length > 0) {
        requestData.tag = tagParts.join(", ");
      }

      console.log("=== Final Request Data ===");
      console.log(JSON.stringify(requestData, null, 2));

      // Call API
      const response = await AddItem(requestData as AddItemRequest);

      if (response.statusCode === 200) {
        Alert.alert(
          ALERT_MESSAGES.SUCCESS_SAVE.title,
          ALERT_MESSAGES.SUCCESS_SAVE.message,
          [
            {
              text: "OK",
              onPress: () => {
                handleClose();
                onSave?.(); // Notify parent to refresh
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Error saving item:", error);
      Alert.alert(
        "Save Failed",
        error.response?.data?.message ||
          "Failed to save item. Please try again."
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
    selectedImage,
    onSave,
    handleClose,
  ]);

  // Handle category selection
  const handleCategorySelect = useCallback((id: number, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
  }, []);

  // Step renderers
  const stepComponents = {
    1: () => (
      <UploadPhotoStep
        selectedImage={selectedImage}
        isLoading={isLoading}
        isDetecting={isDetecting}
        onCameraPress={pickImageFromCamera}
        onGalleryPress={pickImageFromLibrary}
        onDetectPress={handleDetectImage}
      />
    ),
    2: () => (
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
    ),
    3: () => (
      <ReviewStep
        data={{
          name: itemName,
          brand,
          type: categoryName,
          color: color,
          aiDescription: aiDescription,
          weatherSuitable: weatherSuitable,
          condition: condition,
          pattern: pattern,
          fabric: fabric,
          lastWornAt: lastWornAt,
          frequencyWorn: frequencyWorn,
          imageUri: selectedImage,
        }}
      />
    ),
  };

  const renderCurrentStep = () => {
    const StepComponent =
      stepComponents[currentStep as keyof typeof stepComponents];
    return StepComponent ? StepComponent() : null;
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
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Step Content */}
        <View style={styles.stepContent}>{renderCurrentStep()}</View>

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
              style={[
                styles.nextButton,
                (!canProceedToStep(currentStep + 1) && currentStep < 4) ||
                isSaving
                  ? styles.nextButtonDisabled
                  : {},
              ]}
              onPress={currentStep === 3 ? handleSave : handleNext}
              disabled={
                (!canProceedToStep(currentStep + 1) && currentStep < 4) ||
                isSaving
              }
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
            </TouchableOpacity>
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
  nextButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
