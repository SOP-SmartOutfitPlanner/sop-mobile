import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyWardrobeProps {
  onCreateWardrobe: () => void;
}

export const EmptyWardrobe: React.FC<EmptyWardrobeProps> = ({
  onCreateWardrobe,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onCreateWardrobe}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="bag-add-outline" size={48} color="#cbd5e1" />
      </View>
      <Text style={styles.text}>Add Item</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
