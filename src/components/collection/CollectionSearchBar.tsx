import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLLECTION_COLORS } from "../../constants/collectionStyles";

interface CollectionSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const CollectionSearchBar: React.FC<CollectionSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search collections...",
}) => (
  <View style={styles.container}>
    <Ionicons
      name="search-outline"
      size={20}
      color={COLLECTION_COLORS.text.muted}
      style={styles.icon}
    />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLLECTION_COLORS.text.muted}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    height: 52,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "500",
  },
});

export default CollectionSearchBar;
