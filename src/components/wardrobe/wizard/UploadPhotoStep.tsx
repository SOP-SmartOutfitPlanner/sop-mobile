import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UploadPhotoStepProps {
  selectedImage: string | null;
  isLoading: boolean;
  isDetecting: boolean;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onDetectPress: () => void;
}

export const UploadPhotoStep: React.FC<UploadPhotoStepProps> = ({
  selectedImage,
  isLoading,
  isDetecting,
  onCameraPress,
  onGalleryPress,
  onDetectPress,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.photoContainer}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.uploadedImage}
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.successText}>
                Photo uploaded successfully!
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Ionicons name="camera-outline" size={64} color="#9ca3af" />
            <Text style={styles.title}>Upload a photo of your item</Text>
            <Text style={styles.subtitle}>
              Take a photo or choose from your gallery
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onCameraPress}
          disabled={isLoading || isDetecting}
        >
          <Ionicons name="camera" size={20} color="#374151" />
          <Text style={styles.buttonText}>
            {selectedImage ? "Retake Photo" : "Camera"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onGalleryPress}
          disabled={isLoading || isDetecting}
        >
          <Ionicons name="images" size={20} color="#374151" />
          <Text style={styles.buttonText}>
            {selectedImage ? "Choose Another" : "Gallery"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Detect Image Button - Show only when image is selected */}
      {selectedImage && (
        <TouchableOpacity
          style={[
            styles.detectButton,
            isDetecting && styles.detectButtonDisabled,
          ]}
          onPress={onDetectPress}
          disabled={isDetecting}
        >
          {isDetecting ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.detectButtonText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.detectButtonText}>Detect Image with AI</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 50,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    position: "relative",
  },
  uploadedImage: {
    width: 200,
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageOverlay: {
    alignItems: "center",
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
    textAlign: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  detectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 2,
  },
  detectButtonDisabled: {
    opacity: 0.6,
  },
  detectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
