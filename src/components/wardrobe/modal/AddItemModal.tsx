import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useItemUpload } from "../../../hooks/useItemUpload";
import { UploadProgressModal } from "../UploadProgressModal";
import { ManualCategoryModal } from "../ManualCategoryModal";
import { AnalysisPromptModal } from "./AnalysisPromptModal";
import { getUserId } from "../../../services/api/apiClient";
import { useNotification } from "../../../hooks";
import NotificationModal from "@/components/notification/NotificationModal";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  onSuccess?: () => void;
}
export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSave,
  onSuccess,
}) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'multiple' | 'ai'>('multiple');
  const notification = useNotification();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [visible]);

  useEffect(() => {
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab === 'multiple' ? 0 : 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);
  
  const {
    uploadItems,
    uploadSplitOutfit,
    uploadProgress,
    isUploading,
    failedImages,
    successfulItemIds,
    showManualCategoryModal,
    setShowManualCategoryModal,
    showAnalysisPromptModal,
    setShowAnalysisPromptModal,
    handleAnalyzeItems,
    isAnalyzing,
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

  const handleSplitOutfitUpload = async (fromCamera: boolean) => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const pickerFn = fromCamera 
        ? ImagePicker.launchCameraAsync 
        : ImagePicker.launchImageLibraryAsync;

      const result = await pickerFn({
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
      // Note: Manual upload doesn't show analysis prompt
      setTimeout(() => {
        onSuccess?.(); // Refresh wardrobe items
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting manual categories:', error);
    }
  };

  const handleAnalysisComplete = async (selectedItemIds: number[]) => {
    try {
      const result = await handleAnalyzeItems(
        selectedItemIds,
        // onSuccess callback
        (message: string) => {
          notification.showSuccess(message, 'Success');
        },
        // onError callback
        (message: string) => {
          notification.showError(message, 'Error');
        }
      );
      // After analysis completes successfully, refresh and close
      if (result?.success) {
        // Wait a bit for user to see success notification, then refresh and close
        setTimeout(() => {
          onSuccess?.(); // Refresh wardrobe items
          handleClose();
        }, 2000);
      } else {
        // If failed, just close modal (error already shown via notification)
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error in analysis:', error);
      notification.showError('An unexpected error occurred during analysis', 'Error');
      // Even if analysis fails, still refresh and close
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    }
  };

  const handleSkipAnalysis = () => {
    setShowAnalysisPromptModal(false);
    // Refresh and close after skipping
    setTimeout(() => {
      onSuccess?.(); // Refresh wardrobe items
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    setSelectedImages([]);
    resetUpload();
    onClose();
  };

  // Auto-close and refresh when upload completes successfully (auto upload)
  // But only if analysis prompt modal is not showing
  useEffect(() => {
    if (uploadProgress.phase === 'complete' && !showManualCategoryModal && !showAnalysisPromptModal) {
      setTimeout(() => {
        onSuccess?.(); // Refresh wardrobe items
        handleClose();
      }, 1500);
    }
  }, [uploadProgress.phase, showManualCategoryModal, showAnalysisPromptModal]);

  const tabIndicatorTranslate = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (SCREEN_WIDTH - 48) / 2],
  });

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullscreenContainer}>
          {/* Header */}
          <LinearGradient
            colors={["#0f172a", "#1e293b"]}
            style={styles.heroCard}
          >
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Add to Wardrobe</Text>
                <Text style={styles.subtitle}>Upload your clothing items</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <LinearGradient
                  colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                  style={styles.closeButtonBg}
                >
                  <Ionicons name="close" size={20} color="#94a3b8" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <View style={styles.tabBackground}>
                <Animated.View 
                  style={[
                    styles.tabIndicator,
                    { transform: [{ translateX: tabIndicatorTranslate }] }
                  ]} 
                />
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => setActiveTab('multiple')}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="images" 
                    size={18} 
                    color={activeTab === 'multiple' ? "#fff" : "#64748b"} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === 'multiple' && styles.tabTextActive
                  ]}>
                    Multiple Items
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => setActiveTab('ai')}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="sparkles" 
                    size={18} 
                    color={activeTab === 'ai' ? "#fff" : "#64748b"} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === 'ai' && styles.tabTextActive
                  ]}>
                    AI Split
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.sheet}>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              <Animated.View 
                style={{ 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
              >
                {/* Multiple Items Tab */}
                {activeTab === 'multiple' && (
                  <View style={styles.tabContent}>
                    {/* Upload Area */}
                    {selectedImages.length === 0 ? (
                      <View style={styles.uploadArea}>
                        <View style={styles.uploadIconContainer}>
                          <LinearGradient
                            colors={["#3b82f6", "#8b5cf6"]}
                            style={styles.uploadIconBg}
                          >
                            <Ionicons name="cloud-upload" size={32} color="#fff" />
                          </LinearGradient>
                        </View>
                        <Text style={styles.uploadAreaTitle}>Upload Your Items</Text>
                        <Text style={styles.uploadAreaSubtitle}>
                          Take photos or select from gallery
                        </Text>
                        <Text style={styles.uploadLimit}>Up to 10 items at once</Text>
                        
                        <View style={styles.uploadButtons}>
                          <TouchableOpacity
                            style={styles.uploadOptionButton}
                            onPress={() => handlePickImage(true)}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={["#3b82f6", "#2563eb"]}
                              style={styles.uploadOptionGradient}
                            >
                              <View style={styles.uploadOptionIcon}>
                                <Ionicons name="camera" size={24} color="#fff" />
                              </View>
                              <Text style={styles.uploadOptionText}>Camera</Text>
                              <Text style={styles.uploadOptionHint}>Take a photo</Text>
                            </LinearGradient>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.uploadOptionButton}
                            onPress={() => handlePickImage(false)}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={["#8b5cf6", "#7c3aed"]}
                              style={styles.uploadOptionGradient}
                            >
                              <View style={styles.uploadOptionIcon}>
                                <Ionicons name="images" size={24} color="#fff" />
                              </View>
                              <Text style={styles.uploadOptionText}>Gallery</Text>
                              <Text style={styles.uploadOptionHint}>Choose photos</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.selectedImagesContainer}>
                        <View style={styles.previewHeader}>
                          <View style={styles.previewTitleRow}>
                            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                            <Text style={styles.previewTitle}>
                              {selectedImages.length} item{selectedImages.length > 1 ? 's' : ''} selected
                            </Text>
                          </View>
                          <TouchableOpacity 
                            onPress={() => setSelectedImages([])}
                            style={styles.clearButton}
                          >
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
                                <Ionicons name="close" size={12} color="#fff" />
                              </TouchableOpacity>
                              <View style={styles.imageIndex}>
                                <Text style={styles.imageIndexText}>{index + 1}</Text>
                              </View>
                            </View>
                          ))}
                          
                          {/* Add more button */}
                          {selectedImages.length < 10 && (
                            <TouchableOpacity 
                              style={styles.addMoreCard}
                              onPress={() => handlePickImage(false)}
                            >
                              <Ionicons name="add" size={28} color="#64748b" />
                              <Text style={styles.addMoreText}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Upload Button */}
                        <TouchableOpacity
                          style={styles.mainUploadButton}
                          onPress={handleUpload}
                          disabled={isUploading}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={["#22c55e", "#16a34a"]}
                            style={styles.mainUploadGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Ionicons name="cloud-upload" size={22} color="#fff" />
                            <Text style={styles.mainUploadText}>
                              {isUploading ? "Uploading..." : `Upload ${selectedImages.length} Item${selectedImages.length > 1 ? 's' : ''}`}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {/* AI Split Tab */}
                {activeTab === 'ai' && (
                  <View style={styles.tabContent}>
                    {/* AI Feature Card */}
                    <LinearGradient
                      colors={["rgba(168,85,247,0.15)", "rgba(236,72,153,0.1)"]}
                      style={styles.aiFeatureCard}
                    >
                      <View style={styles.aiBadge}>
                        <Ionicons name="sparkles" size={12} color="#fff" />
                        <Text style={styles.aiBadgeText}>AI POWERED</Text>
                      </View>
                      
                      <View style={styles.aiIconContainer}>
                        <LinearGradient
                          colors={["#a855f7", "#ec4899"]}
                          style={styles.aiIconBg}
                        >
                          <Ionicons name="shirt" size={36} color="#fff" />
                        </LinearGradient>
                      </View>

                      <Text style={styles.aiTitle}>Smart Outfit Split</Text>
                    </LinearGradient>

                    {/* AI Upload Buttons */}
                    <View style={styles.aiUploadButtons}>
                      <TouchableOpacity
                        style={styles.aiUploadButton}
                        onPress={() => handleSplitOutfitUpload(true)}
                        disabled={isUploading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={["#f97316", "#ea580c"]}
                          style={styles.aiUploadGradient}
                        >
                          <Ionicons name="camera" size={26} color="#fff" />
                          <Text style={styles.aiUploadText}>Camera</Text>
                          <Text style={styles.aiUploadHint}>Take a full-body photo</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.aiUploadButton}
                        onPress={() => handleSplitOutfitUpload(false)}
                        disabled={isUploading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={["#ec4899", "#db2777"]}
                          style={styles.aiUploadGradient}
                        >
                          <Ionicons name="images" size={26} color="#fff" />
                          <Text style={styles.aiUploadText}>Gallery</Text>
                          <Text style={styles.aiUploadHint}>Choose from photos</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Animated.View>
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

      {/* Analysis Prompt Modal */}
      <AnalysisPromptModal
        visible={showAnalysisPromptModal}
        itemIds={successfulItemIds}
        onAnalyze={handleAnalysisComplete}
        onSkip={handleSkipAnalysis}
        isAnalyzing={isAnalyzing}
      />

      {/* Notification Modal */}
      <NotificationModal
        isVisible={notification.visible}
        type={notification.config.type}
        title={notification.config.title}
        message={notification.config.message}
        confirmText={notification.config.confirmText}
        cancelText={notification.config.cancelText}
        showCancel={notification.config.showCancel}
        onConfirm={() => {
          notification.config.onConfirm?.();
        }}
        onClose={notification.hideNotification}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  sheet: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  heroCard: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Tab Styles
  tabContainer: {
    paddingHorizontal: 0,
  },
  tabBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 4,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    width: "50%",
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#fff",
  },

  // Content Styles
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 20,
  },

  // Upload Area (Empty State)
  uploadArea: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(59,130,246,0.3)",
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadAreaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },
  uploadAreaSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 4,
  },
  uploadLimit: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 24,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  uploadOptionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  uploadOptionGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  uploadOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  uploadOptionHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },

  // Selected Images Container
  selectedImagesContainer: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  previewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f8fafc",
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearPreview: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  imageCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageIndex: {
    position: "absolute",
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageIndexText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  addMoreCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  addMoreText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  mainUploadButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  mainUploadGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  mainUploadText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },



  // AI Feature Card
  aiFeatureCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.2)",
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#a855f7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  aiIconContainer: {
    marginBottom: 16,
  },
  aiIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  aiTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },

  // AI Upload Buttons
  aiUploadButtons: {
    flexDirection: "row",
    gap: 12,
  },
  aiUploadButton: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  aiUploadGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  aiUploadText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  aiUploadHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },

  // AI Tips Card
 
});


