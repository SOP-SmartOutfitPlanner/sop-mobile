import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CollectionSearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#94A3B8" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search collections..."
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
  },
});

export default CollectionSearchBar;
