import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWardrobe } from "../hooks/useMockData";
import { WardrobeItem } from "../types";
import { ItemCard } from "../components/wardrobe/ItemCard";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { OutfitBuilderModal } from "../components/wardrobe/OutfitBuilderModal";
import { FilterModal } from "../components/wardrobe/FilterModal";
import { AddItemModal } from "../components/wardrobe/AddItemModal";
import { WardrobeGoals } from "../components/wardrobe/WardrobeGoals";
import { WardrobeStats } from "../components/wardrobe/WardrobeStats";
import { TypeDistribution } from "../components/wardrobe/TypeDistribution";
import { MostWorn } from "../components/wardrobe/MostWorn";
import { DeclutterHints } from "../components/wardrobe/DeclutterHints";
import {
  mockWardrobeGoals,
  mockWardrobeStats,
  mockTypeDistribution,
  mockPopularColors,
  mockMostWornItems,
  mockDeclutterHints,
} from "../hooks/mockData";

const { width } = Dimensions.get("window");

type ViewMode = "grid" | "list";

const WardrobeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [outfitBuilderItem, setOutfitBuilderItem] =
    useState<WardrobeItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { items, loading } = useWardrobe();

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleItemClick = (item: WardrobeItem) => {
    setSelectedItem(item);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleUseInOutfit = (item: WardrobeItem) => {
    setSelectedItem(null);
    setOutfitBuilderItem(item);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand &&
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some(
        (filter) =>
          item.type === filter ||
          item.seasons.includes(filter as any) ||
          item.occasions.includes(filter as any)
      );

    return matchesSearch && matchesFilters;
  });

  const renderLoadingGrid = () => (
    <View style={styles.loadingContainer}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={styles.loadingCard}>
          <View style={styles.loadingImage} />
          <View style={styles.loadingContent}>
            <View style={styles.loadingTitle} />
            <View style={styles.loadingSubtitle} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderItems = () => {
    const numColumns = viewMode === "grid" ? 2 : 1;
    const itemWidth = viewMode === "grid" ? (width - 40) / 2 - 8 : width - 32;

    return (
      <View style={styles.itemsContainer}>
        {filteredItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemWrapper,
              {
                width: itemWidth,
                marginRight: viewMode === "grid" && index % 2 === 0 ? 16 : 0,
              },
            ]}
          >
            <ItemCard item={item} onItemClick={handleItemClick} />
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderLoadingGrid()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>My Wardrobe</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Ionicons
              name="refresh"
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
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Ionicons name="filter" size={16} color="#666" />
            <Text style={styles.filterText}>Filters</Text>
            {selectedFilters.length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {selectedFilters.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "grid" && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode("grid")}
            >
              <Ionicons
                name="grid"
                size={16}
                color={viewMode === "grid" ? "#fff" : "#666"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "list" && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode("list")}
            >
              <Ionicons
                name="list"
                size={16}
                color={viewMode === "list" ? "#fff" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Results Count */}
        <Text style={styles.resultsCount}>
          {filteredItems.length} items found
        </Text>

        {/* Items Grid */}
        {renderItems()}

        {/* Wardrobe Sections */}
        <View style={styles.sectionsContainer}>
          <WardrobeGoals goals={mockWardrobeGoals} />
          <WardrobeStats stats={mockWardrobeStats} />
          <TypeDistribution
            typeData={mockTypeDistribution}
            colorData={mockPopularColors}
          />
          <MostWorn items={mockMostWornItems} />
          <DeclutterHints hints={mockDeclutterHints} />
        </View>

        {/* Bottom spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB for adding items */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddItemModalOpen(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <ItemDetailModal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onUseInOutfit={handleUseInOutfit}
      />

      <OutfitBuilderModal
        visible={!!outfitBuilderItem}
        onClose={() => setOutfitBuilderItem(null)}
        item={outfitBuilderItem}
      />

      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onFilterToggle={toggleFilter}
        onClearFilters={clearFilters}
      />

      <AddItemModal
        visible={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
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
  viewModeContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: "#3b82f6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemWrapper: {
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingCard: {
    width: (width - 40) / 2 - 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingImage: {
    height: 150,
    backgroundColor: "#e5e7eb",
  },
  loadingContent: {
    padding: 12,
  },
  loadingTitle: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingSubtitle: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "60%",
  },
  sectionsContainer: {
    marginTop: 32,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
export default WardrobeScreen;
