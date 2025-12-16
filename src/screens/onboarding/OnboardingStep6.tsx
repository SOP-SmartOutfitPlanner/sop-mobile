import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { MinioUpload } from "../../services/endpoint/upload";

interface OnboardingStep6Props {
  navigation: any;
  onNext: (imageUrls: string[]) => void;
  onBack: () => void;
}

export const OnboardingStep6: React.FC<OnboardingStep6Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        setSelectedImage(asset.uri);
        
        // Save file info for upload
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';
        setSelectedImageFile({
          uri: asset.uri,
          type: asset.mimeType || `image/${fileExtension}`,
          name: asset.fileName || `tryon_${Date.now()}.${fileExtension}`,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  const handleContinue = async () => {
    if (!selectedImage || !selectedImageFile) {
      Alert.alert(
        "No Image Selected",
        "Please upload a full body photo to continue."
      );
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image to Minio and get downloadUrl
      const response = await MinioUpload(selectedImageFile);
      
      if (response.statusCode === 200 && response.data?.downloadUrl) {
        onNext([response.data.downloadUrl]);
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Alert.alert(
        'Upload Failed',
        error?.message || 'Failed to upload image. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { 
                    width: "100%",
                    opacity: fadeAnim,
                  }
                ]} 
              />
            </View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name="body" size={48} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>Add Your Full Body Photo</Text>
              <Text style={styles.subtitle}>
                Upload a full body photo for virtual try-on features
              </Text>
            </Animated.View>

            {/* Upload Area */}
            <Animated.View 
              style={[
                styles.uploadArea,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              {!selectedImage ? (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIcon}>
                    <Ionicons name="person" size={48} color="#60a5fa" />
                  </View>
                  <Text style={styles.uploadTitle}>Upload Full Body Photo</Text>
                  <Text style={styles.uploadSubtitle}>Click to select from gallery or camera</Text>
                  <Text style={styles.uploadInfo}>PNG, JPG, WEBP - Max 10MB</Text>
                  
                  <View style={styles.uploadButtons}>
                    {/* <TouchableOpacity
                      style={[styles.uploadButton, styles.cameraButton]}
                      onPress={() => handlePickImage(true)}
                      disabled={isUploading}
                    >
                      <Ionicons name="camera" size={20} color="#fff" />
                      <Text style={styles.uploadButtonText}>Camera</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                      style={[styles.uploadButton, styles.galleryButton]}
                      onPress={() => handlePickImage(false)}
                      disabled={isUploading}
                    >
                      <Ionicons name="images" size={20} color="#fff" />
                      <Text style={styles.uploadButtonText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleRemoveImage}
                  >
                    <Ionicons name="close-circle" size={32} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            {/* Tips Card */}
            <Animated.View 
              style={[
                styles.tipsCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.tipsHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                <Text style={styles.tipsTitle}>Tips for best results</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>1</Text>
                  </View>
                  <Text style={styles.tipText}>Stand in front of a <Text style={styles.tipBold}>plain background</Text></Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>2</Text>
                  </View>
                  <Text style={styles.tipText}>Ensure your <Text style={styles.tipBold}>full body is visible</Text> from head to toe</Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>3</Text>
                  </View>
                  <Text style={styles.tipText}><Text style={styles.tipBold}>Good lighting</Text> helps with accurate try-on results</Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>4</Text>
                  </View>
                  <Text style={styles.tipText}>Wear <Text style={styles.tipBold}>fitted clothing</Text> for best virtual try-on</Text>
                </View>
              </View>
            </Animated.View>

            {/* Why Card */}
            <Animated.View 
              style={[
                styles.whyCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.whyHeader}>
                <Ionicons name="bulb" size={24} color="#a855f7" />
                <Text style={styles.whyTitle}>Why do we need this?</Text>
              </View>
              <Text style={styles.whyText}>
                This image is used for <Text style={styles.whyBold}>virtual try-on</Text> features to preview how clothes look on you before making outfit decisions.
              </Text>
            </Animated.View>

            <View style={styles.fileInfoFooter}>
              <Text style={styles.fileInfoText}>
                Supported formats: PNG, JPG, WEBP • Maximum file size: 10MB
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <Animated.View 
            style={[
              styles.bottomNav,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              disabled={isUploading}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  isUploading && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={isUploading}
              >
                <LinearGradient
                  colors={isUploading ? ["#1e3a5f", "#152238"] : ["#193C9E", "#1e40af"]}
                  style={styles.nextButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.nextButtonText}>Continue</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#193C9E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1e40af",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  optionalText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
  },
  uploadArea: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(96, 165, 250, 0.3)",
    borderStyle: "dashed",
    padding: 24,
    marginBottom: 20,
    minHeight: 280,
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
    textAlign: "center",
  },
  uploadInfo: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 20,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  uploadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cameraButton: {
    backgroundColor: "#3b82f6",
  },
  galleryButton: {
    backgroundColor: "#8b5cf6",
  },
  imagePreview: {
    position: "relative",
    width: "100%",
    aspectRatio: 3/4,
    borderRadius: 16,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1e293b",
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
  tipsCard: {
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#22c55e",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: "700",
    color: "#f8fafc",
  },
  whyCard: {
    backgroundColor: "rgba(168, 85, 247, 0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
  },
  whyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#a855f7",
  },
  whyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  whyBold: {
    fontWeight: "700",
    color: "#c084fc",
  },
  fileInfoFooter: {
    alignItems: "center",
    marginBottom: 16,
  },
  fileInfoText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(10, 22, 40, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  rightButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  nextButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
