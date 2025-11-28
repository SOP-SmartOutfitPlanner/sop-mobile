import React, { useEffect, useMemo, useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useItemUpload } from "../../../hooks/useItemUpload";
import { UploadProgressModal } from "../UploadProgressModal";
import { ManualCategoryModal } from "../ManualCategoryModal";
import { getUserId } from "../../../services/api/apiClient";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  onSuccess?: () => void; // Callback after successful upload
}
export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
  onSuccess,
}) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  
  const {
    uploadItems,
    uploadSplitOutfit,
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

  const handleSplitOutfitUpload = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';

        const outfitImage = {
          uri: asset.uri,
          type: asset.mimeType || `image/${fileExtension}`,
          name: asset.fileName || `outfit_${Date.now()}.${fileExtension}`,
          fileName: asset.fileName || `outfit_${Date.now()}.${fileExtension}`,
          mimeType: asset.mimeType || `image/${fileExtension}`,
        };

        await uploadSplitOutfit(outfitImage);
      }
    } catch (error) {
      console.error('Error processing outfit image:', error);
      Alert.alert('Error', 'Failed to process outfit image. Please try again.');
    }
  };

  const handleManualCategorySubmit = async (selections: { imageURLs: string; categoryId: number }[]) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }
      
      await submitManualCategories(parseInt(userId), selections);
      
      // Call success callback after manual upload completes
      setTimeout(() => {
        onSuccess?.(); // Refresh wardrobe items
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting manual categories:', error);
    }
  };

  const handleClose = () => {
    setSelectedImages([]);
    resetUpload();
    onClose();
  };

  // Auto-close and refresh when upload completes successfully (auto upload)
  useEffect(() => {
    if (uploadProgress.phase === 'complete' && !showManualCategoryModal) {
      setTimeout(() => {
        onSuccess?.(); // Refresh wardrobe items
        handleClose();
      }, 1500);
    }
  }, [uploadProgress.phase, showManualCategoryModal]);

  const multiHighlights = useMemo(
    () => [
      { icon: "sparkles", text: "AI auto-tags each piece" },
      { icon: "images-outline", text: "Bulk upload up to 10" },
      { icon: "shield-checkmark", text: "Keeps photo quality" },
    ],
    []
  );

  const outfitHighlights = useMemo(
    () => [
      { icon: "cut", text: "Smart outfit segmentation" },
      { icon: "timer-outline", text: "Takes ~15 seconds" },
      { icon: "color-palette-outline", text: "Background cleaned" },
    ],
    []
  );

  const renderHighlights = (items: { icon: any; text: string }[]) => (
    <View style={styles.highlightGrid}>
      {items.map((item) => (
        <View key={item.text} style={styles.highlightChip}>
          <Ionicons name={item.icon} size={14} color="#cbd5f5" />
          <Text style={styles.highlightText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullscreenContainer}>
          <LinearGradient
            colors={["rgba(56,189,248,0.25)", "rgba(124,58,237,0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroCard}
          >
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Add Items to Wardrobe</Text>
                <Text style={styles.subtitle}>Choose how you want to add items</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={22} color="#e2e8f0" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.sheet}>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="images" size={28} color="#38bdf8" />
                  <Text style={styles.cardLabel}>Multiple Items</Text>
                </View>
                <Text style={styles.cardTitle}>Upload up to 10 items</Text>
                <Text style={styles.cardDescription}>
                  Pick photos from camera or gallery. We'll auto-classify each piece.
                </Text>
                {renderHighlights(multiHighlights)}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cameraButton]}
                    onPress={() => handlePickImage(true)}
                    disabled={selectedImages.length >= 10}
                  >
                    <Ionicons name="camera" size={22} color="#fff" />
                    <Text style={styles.actionButtonText}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.galleryButton]}
                    onPress={() => handlePickImage(false)}
                    disabled={selectedImages.length >= 10}
                  >
                    <Ionicons name="images" size={22} color="#fff" />
                    <Text style={styles.actionButtonText}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                {selectedImages.length > 0 && (
                  <>
                    <View style={styles.previewHeader}>
                      <Text style={styles.previewTitle}>Selected ({selectedImages.length}/10)</Text>
                      <TouchableOpacity onPress={() => setSelectedImages([])}>
                        <Text style={styles.clearPreview}>Clear all</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.imagesGrid}>
                      {selectedImages.map((image, index) => (
                        <View key={`${image.uri}-${index}`} style={styles.imageCard}>
                          <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveImage(index)}
                          >
                            <Ionicons name="close" size={14} color="#0f172a" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {selectedImages.length > 0 && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUpload}
                    disabled={isUploading}
                  >
                    <Ionicons name="cloud-upload" size={20} color="#0f172a" />
                    <Text style={styles.uploadButtonText}>
                      {isUploading ? "Uploading..." : `Upload ${selectedImages.length} item${selectedImages.length > 1 ? "s" : ""}`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="sparkles" size={28} color="#c084fc" />
                  <Text style={styles.cardLabel}>Outfit Image</Text>
                </View>
                <Text style={styles.cardTitle}>AI Outfit Split</Text>
                <Text style={styles.cardDescription}>
                  Upload a single outfit photo. We'll split the look into individual items automatically.
                </Text>
                {renderHighlights(outfitHighlights)}
                <View style={styles.tipCard}>
                  <Ionicons name="information-circle-outline" size={16} color="#fcd34d" />
                  <Text style={styles.tipText}>
                    Tip: Use full-body photos with good lighting for best splits.
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, styles.splitButton]}
                  onPress={handleSplitOutfitUpload}
                  disabled={isUploading}
                >
                  <Ionicons name="shirt" size={22} color="#fff" />
                  <Text style={styles.actionButtonText}>Choose Outfit Photo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#040816",
  },
  sheet: {
    flex: 1,
    backgroundColor: "#050818",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  heroCard: {
    paddingTop: 56,
    paddingHorizontal: 24,
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
  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  heroStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  heroStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
  contentContainer: {
    paddingBottom: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#cbd5f5",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
  },
  cardDescription: {
    color: "#cbd5f5",
    fontSize: 14,
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  imageCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    backgroundColor: "#11173a",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: "#2563eb",
  },
  galleryButton: {
    backgroundColor: "#7c3aed",
  },
  splitButton: {
    backgroundColor: "#f97316",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  uploadButton: {
    marginTop: 12,
    backgroundColor: "#38bdf8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    paddingVertical: 18,
  },
  uploadButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  previewTitle: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
  },
  clearPreview: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "600",
  },
  highlightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(148,163,184,0.15)",
  },
  highlightText: {
    color: "#e2e8f0",
    fontSize: 12,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(250,204,21,0.12)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.2)",
  },
  tipText: {
    color: "#fef3c7",
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});


