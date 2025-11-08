import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useItemUpload } from "../../../hooks/useItemUpload";
import { UploadProgressModal } from "../UploadProgressModal";
import { ManualCategoryModal } from "../ManualCategoryModal";
import { getUserId } from "../../../services/api/apiClient";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

/**
 * New AddItemModal following the upload flow:
 * 1. Select up to 10 images
 * 2. Upload to Minio
 * 3. Auto classify with bulk-upload/auto
 * 4. Manual category for failed images
 * 5. Show analysis button for unanalyzed items
 */
export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  
  const {
    uploadItems,
    uploadProgress,
    isUploading,
    failedImages,
    showManualCategoryModal,
    setShowManualCategoryModal,
    submitManualCategories,
    resetUpload,
  } = useItemUpload();

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and photo library permissions to upload images.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const handlePickImage = async (fromCamera: boolean) => {
    if (selectedImages.length >= 10) {
      Alert.alert("Maximum Limit", "You can only upload up to 10 images at once");
      return;
    }

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const pickerFn = fromCamera 
        ? ImagePicker.launchCameraAsync 
        : ImagePicker.launchImageLibraryAsync;
        
      const result = await pickerFn({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Extract file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';
        
        const imageData = {
          uri: asset.uri,
          type: asset.mimeType || `image/${fileExtension}`,
          name: asset.fileName || `photo_${Date.now()}.${fileExtension}`,
          fileName: asset.fileName || `photo_${Date.now()}.${fileExtension}`,
          mimeType: asset.mimeType || `image/${fileExtension}`,
        };
        
        setSelectedImages(prev => [...prev, imageData]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("No Images", "Please select at least one image");
      return;
    }

    await uploadItems(selectedImages);
  };

  const handleManualCategorySubmit = async (selections: { imageURLs: string; categoryId: number }[]) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }
      
      await submitManualCategories(parseInt(userId), selections);
    } catch (error) {
      console.error('Error submitting manual categories:', error);
    }
  };

  const handleClose = () => {
    setSelectedImages([]);
    resetUpload();
    onClose();
  };

  // Auto-close and refresh when upload completes
  useEffect(() => {
    if (uploadProgress.phase === 'complete' && !showManualCategoryModal) {
      setTimeout(() => {
        handleClose();
        onSave?.();
      }, 1500);
    }
  }, [uploadProgress.phase, showManualCategoryModal, onSave]);

  return (
    <>
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
            <Text style={styles.headerTitle}>Add Items</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>
                Upload up to 10 images. Items will be automatically classified and added to your wardrobe.
              </Text>
            </View>

            {/* Selected Images Grid */}
            {selectedImages.length > 0 && (
              <View style={styles.imagesGrid}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageCard}>
                    <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Image count */}
            {selectedImages.length > 0 && (
              <Text style={styles.imageCount}>
                {selectedImages.length} / 10 images selected
              </Text>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cameraButton]}
                onPress={() => handlePickImage(true)}
                disabled={selectedImages.length >= 10}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.galleryButton]}
                onPress={() => handlePickImage(false)}
                disabled={selectedImages.length >= 10}
              >
                <Ionicons name="images" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Upload Button */}
            {selectedImages.length > 0 && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                disabled={isUploading}
              >
                <Ionicons name="cloud-upload" size={20} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {isUploading ? 'Uploading...' : `Upload ${selectedImages.length} Image${selectedImages.length > 1 ? 's' : ''}`}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Progress Modal */}
      <UploadProgressModal visible={isUploading} progress={uploadProgress} />

      {/* Manual Category Selection Modal */}
      <ManualCategoryModal
        visible={showManualCategoryModal}
        failedImages={failedImages}
        onClose={() => setShowManualCategoryModal(false)}
        onSubmit={handleManualCategorySubmit}
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  imageCard: {
    width: '31%',
    aspectRatio: 1,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  imageCount: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: "#3b82f6",
  },
  galleryButton: {
    backgroundColor: "#8b5cf6",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

