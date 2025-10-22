import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface DetailImageProps {
  imageUrl?: string;
}

export const DetailImage: React.FC<DetailImageProps> = ({ imageUrl }) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{
          uri: imageUrl || "https://via.placeholder.com/400x500?text=No+Image",
        }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: width * 1.25,
    backgroundColor: "#f9fafb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
