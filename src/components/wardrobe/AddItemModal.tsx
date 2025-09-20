import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useImagePicker } from "../../hooks/useImagePicker";
import { StepIndicator } from "./wizard/StepIndicator";
import { UploadPhotoStep } from "./wizard/UploadPhotoStep";
import { ItemDetailsStep } from "./wizard/ItemDetailsStep";
import { CategoriesStep } from "./wizard/CategoriesStep";
import { ReviewStep } from "./wizard/ReviewStep";
import { ALERT_MESSAGES } from "../../constants/wardrobe";
import { NewWardrobeItem } from "../../types";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (item: NewWardrobeItem) => void;
}

const STEPS = [
  { id: 1, title: "Upload", subtitle: "Photo" },
  { id: 2, title: "Item", subtitle: "Details" },
  { id: 3, title: "Type", subtitle: "category" },
  { id: 4, title: "Review ", subtitle: "& Save" },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  // Image picker hook
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
    setSelectedType("");
    setSelectedColor("");
    setSelectedSeasons([]);
    setSelectedOccasions([]);
    resetImage();
  }, [resetImage]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Step validation
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return !!selectedImage;
      case 3:
        return !!itemName.trim() && !!selectedType;
      case 4:
        return selectedSeasons.length > 0 && selectedOccasions.length > 0;
      default:
        return true;
    }
  };

  // Validation messages
  const getValidationMessage = (step: number): string => {
    const messages = {
      1: "Please select a photo first",
      2: "Please fill in item name and type",
      3: "Please select at least one season and occasion",
    };
    return messages[step as keyof typeof messages] || "";
  };

  const handleNext = () => {
    if (currentStep < 4) {
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

  const handleSave = useCallback(() => {
    const itemData: NewWardrobeItem = {
      name: itemName.trim(),
      brand: brand.trim() || undefined,
      type: selectedType,
      color: selectedColor,
      imageUri: selectedImage,
      seasons: selectedSeasons as any,
      occasions: selectedOccasions as any,
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
    selectedType,
    selectedColor,
    selectedImage,
    selectedSeasons,
    selectedOccasions,
    onSave,
    handleClose,
  ]);

  // Toggle handlers for categories
  const toggleSelection =
    (items: string[], setItems: (items: string[]) => void) =>
    (item: string) => {
      setItems(
        items.includes(item)
          ? items.filter((i) => i !== item)
          : [...items, item]
      );
    };

  const handleSeasonToggle = toggleSelection(
    selectedSeasons,
    setSelectedSeasons
  );
  const handleOccasionToggle = toggleSelection(
    selectedOccasions,
    setSelectedOccasions
  );

  // Step renderers
  const stepComponents = {
    1: () => (
      <UploadPhotoStep
        selectedImage={selectedImage}
        isLoading={isLoading}
        onCameraPress={pickImageFromCamera}
        onGalleryPress={pickImageFromLibrary}
      />
    ),
    2: () => (
      <ItemDetailsStep
        itemName={itemName}
        brand={brand}
        selectedType={selectedType}
        selectedColor={selectedColor}
        onItemNameChange={setItemName}
        onBrandChange={setBrand}
        onTypeSelect={setSelectedType}
        onColorSelect={setSelectedColor}
      />
    ),
    3: () => (
      <CategoriesStep
        selectedSeasons={selectedSeasons}
        selectedOccasions={selectedOccasions}
        onSeasonToggle={handleSeasonToggle}
        onOccasionToggle={handleOccasionToggle}
      />
    ),
    4: () => (
      <ReviewStep
        data={{
          name: itemName,
          brand,
          type: selectedType,
          colors: selectedColor ? [selectedColor] : [],
          seasons: selectedSeasons,
          occasions: selectedOccasions,
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
                !canProceedToStep(currentStep + 1) &&
                  currentStep < 4 &&
                  styles.nextButtonDisabled,
              ]}
              onPress={currentStep === 4 ? handleSave : handleNext}
              disabled={!canProceedToStep(currentStep + 1) && currentStep < 4}
            >
              {currentStep === 4 ? (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.nextButtonText}>Save Item</Text>
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
