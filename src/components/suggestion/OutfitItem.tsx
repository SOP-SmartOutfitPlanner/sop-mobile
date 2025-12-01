import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface OutfitItemProps {
  name: string;
  image?: ImageSourcePropType;
  imageUrl?: string;
  categoryName?: string;
}

const OutfitItem: React.FC<OutfitItemProps> = ({ name, image, imageUrl, categoryName }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#10B981"
          style={styles.checkIcon}
        />
        {imageUrl ? (
          <RNImage
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>{name}</Text>
      {categoryName && (
        <Text style={styles.category} numberOfLines={1}>{categoryName}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  checkIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  label: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 80,
    marginTop: 4,
  },
  category: {
    fontSize: 9,
    color: "#94A3B8",
    textAlign: "center",
    maxWidth: 80,
    marginTop: 2,
  },
  placeholder: {
    backgroundColor: "#E2E8F0",
  },
});

export default OutfitItem;
