import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PhotoSectionProps {
  selectedImage: string | null;
  isLoading: boolean;
  onPress: () => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  selectedImage,
  isLoading,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.photoSection}
      onPress={onPress}
      disabled={isLoading}
    >
      {selectedImage ? (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.changePhotoText}>
              {isLoading ? "Loading..." : "Change Photo"}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <Ionicons
            name="camera"
            size={32}
            color={isLoading ? "#9ca3af" : "#6b7280"}
          />
          <Text style={styles.photoText}>
            {isLoading ? "Loading..." : "Add Photo"}
          </Text>
          <Text style={styles.photoSubText}>
            Tap to take a photo or choose from library
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoSection: {
    height: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  photoText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
  photoSubText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  selectedImageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
});
