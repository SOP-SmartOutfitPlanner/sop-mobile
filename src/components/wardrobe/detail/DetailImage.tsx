import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";

const { width } = Dimensions.get("window");

interface DetailImageProps {
  imageUrl?: string;
  isAnalyzed?: boolean;
}

export const DetailImage: React.FC<DetailImageProps> = ({ 
  imageUrl,
  isAnalyzed = false,
}) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{
          uri: imageUrl || "https://via.placeholder.com/400x500?text=No+Image",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      {isAnalyzed && (
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: width * 1.25,
    backgroundColor: "#11173a",
    position: "relative",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  aiBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59,130,246,0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
