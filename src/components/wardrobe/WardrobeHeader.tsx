import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WardrobeControlsProps {
  itemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: string[];
  onFilterPress: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WardrobeControls: React.FC<WardrobeControlsProps> = ({
  itemCount,
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterPress,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <View style={styles.container}>
      {/* Item Count Section */}
      <View style={styles.headerTop}>
        <View style={styles.itemCount}>
          <Ionicons name="cube-outline" size={20} color="#3b82f6" />
          <View style={styles.countInfo}>
            <Text style={styles.countNumber}>{itemCount} items</Text>
            <Text style={styles.countSubtext}>Last updated Jan 2024</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={isRefreshing}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#666"
            style={isRefreshing && styles.rotating}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your wardrobe..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter and View Options */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={16} color="#666" />
          <Text style={styles.filterText}>Filters</Text>
          {selectedFilters.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {selectedFilters.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemCount: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  countInfo: {
    marginLeft: 8,
  },
  countNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  countSubtext: {
    fontSize: 12,
    color: "#6b7280",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
  },
  rotating: {
    transform: [{ rotate: "180deg" }],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  filterBadge: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
