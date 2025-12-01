import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OutfitSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onFavoritesPress?: () => void;
  showFavoritesOnly?: boolean;
}

export const OutfitSearchBar: React.FC<OutfitSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search outfits...",
  onFilterPress,
  onFavoritesPress,
  showFavoritesOnly = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>
      {onFavoritesPress && (
        <TouchableOpacity
          style={[styles.filterButton, showFavoritesOnly && styles.filterButtonActive]}
          onPress={onFavoritesPress}
        >
          <Ionicons
            name={showFavoritesOnly ? "heart" : "heart-outline"}
            size={18}
            color={showFavoritesOnly ? "#fff" : "#94a3b8"}
          />
        </TouchableOpacity>
      )}
      {onFilterPress && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="filter" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 3,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#e2e8f0",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(224,242,254,0.3)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: "rgba(239,68,68,0.9)",
    borderColor: "#ef4444",
  },
});

