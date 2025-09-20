import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UploadPhotoStepProps {
  selectedImage: string | null;
  isLoading: boolean;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

export const UploadPhotoStep: React.FC<UploadPhotoStepProps> = ({
  selectedImage,
  isLoading,
  onCameraPress,
  onGalleryPress,
}) => {
  return (
    <View style={styles.container}>
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
          disabled={isLoading}
        >
          <Ionicons name="camera" size={20} color="#374151" />
          <Text style={styles.buttonText}>
            {selectedImage ? "Retake Photo" : "Camera"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onGalleryPress}
          disabled={isLoading}
        >
          <Ionicons name="images" size={20} color="#374151" />
          <Text style={styles.buttonText}>
            {selectedImage ? "Choose Another" : "Gallery"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
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
});
