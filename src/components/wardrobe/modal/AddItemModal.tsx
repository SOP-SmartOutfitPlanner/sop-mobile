import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useImagePicker } from "../../../hooks/useImagePicker";
import { UploadPhotoStep } from "../wizard/UploadPhotoStep";
import { useAIDetection } from "../../../contexts/AIDetectionContext";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

/**
 * Simplified AddItemModal - only Upload & Detect step
 * Item will be automatically created by AI detection context
 * Modal automatically closes when item is created successfully
 */
export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const {
    selectedImage,
    isLoading,
    pickImageFromCamera,
    pickImageFromLibrary,
    resetImage,
  } = useImagePicker();

  const { detectImage, isDetecting, hasCompletedDetection, clearDetection } = useAIDetection();

  // Auto-detect image when selected
  useEffect(() => {
    if (selectedImage && visible) {
      detectImage(selectedImage);
    }
  }, [selectedImage, visible, detectImage]);

  // Auto-close modal when detection completes and item is created
  useEffect(() => {
    if (hasCompletedDetection && visible) {
      // Close modal after a short delay to let user see the success state
      const timer = setTimeout(() => {
        handleClose();
        onSave?.();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [hasCompletedDetection, visible, onSave]);

  const handleClose = () => {
    resetImage();
    clearDetection();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <UploadPhotoStep
            selectedImage={selectedImage}
            isLoading={isLoading || isDetecting}
            onCameraPress={pickImageFromCamera}
            onGalleryPress={pickImageFromLibrary}
          />
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
  content: {
    flex: 1,
  },
});
