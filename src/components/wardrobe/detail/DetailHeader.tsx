import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DetailHeaderProps {
  onClose: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  onClose,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.button}>
        <Ionicons name="close" size={24} color="#1f2937" />
      </TouchableOpacity>
      <Text style={styles.title}>Item Details</Text>
      <TouchableOpacity onPress={onFavoritePress} style={styles.button}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#ef4444" : "#6b7280"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
});
