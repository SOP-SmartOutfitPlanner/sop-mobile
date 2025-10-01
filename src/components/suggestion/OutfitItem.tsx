import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OutfitItemProps {
  name: string;
  image: ImageSourcePropType;
}

const OutfitItem: React.FC<OutfitItemProps> = ({ name, image }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#10B981"
          style={styles.checkIcon}
        />
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.label}>{name}</Text>
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
  },
});

export default OutfitItem;
