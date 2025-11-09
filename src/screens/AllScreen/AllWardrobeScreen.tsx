import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../../components/common/Header";
import { Item } from "../../types/item";
import { useWardrobe } from "../../hooks/useWardrobe";
import { WardrobeItemGrid } from "../../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../../components/wardrobe/ItemDetailModal";
import { FilterModal } from "../../components/wardrobe/FilterModal";
import { AnalyzeItemsButton } from "../../components/wardrobe/AnalyzeItemsButton";

const AllWardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    items,
    searchQuery,
    setSearchQuery,
    loading,
    isRefreshing,
    handleRefresh,
    editItem,
    deleteItem,
    clearFilters,
    selectedCategoryId,
    selectedSeasonId,
    selectedStyleId,
    selectedOccasionId,
    isAnalyzedFilter,
    setCategoryFilter,
    setSeasonFilter,
    setStyleFilter,
    setOccasionFilter,
    setAnalyzedFilter,
  } = useWardrobe();

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleUseInOutfit = (item: Item) => {
    setSelectedItem(null);
    // Navigate to outfit builder with this item
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Calculate active filters count
  const activeFiltersCount = [
    selectedCategoryId,
    selectedSeasonId,
    selectedStyleId,
    selectedOccasionId,
    isAnalyzedFilter,
  ].filter((filter) => filter !== undefined).length;

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="All Items"
          showBackButton={true}
          onBackPress={handleBackPress}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <WardrobeLoadingGrid />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="All Items"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Search and Filter Bar */}
        <View style={styles.controlsContainer}>
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
              placeholder="Search in wardrobe..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Ionicons name="options-outline" size={20} color="#64748b" />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Item Count */}
        <View style={styles.itemCountContainer}>
          <Text style={styles.itemCountText}>
            {items.length} Items
          </Text>
        </View>

        {/* Analyze Items Button */}
        <AnalyzeItemsButton items={items} onAnalysisComplete={handleRefresh} />

        {/* Items Grid */}
        {items.length > 0 ? (
          <WardrobeItemGrid items={items} onItemClick={handleItemClick} />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="shirt-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {searchQuery || activeFiltersCount > 0
                ? "No items found"
                : "No items in wardrobe. Add some!"}
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <ItemDetailModal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onUseInOutfit={handleUseInOutfit}
        onRefresh={handleRefresh}
        editItem={editItem}
        deleteItem={deleteItem}
      />

      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategoryId={selectedCategoryId}
        selectedSeasonId={selectedSeasonId}
        selectedStyleId={selectedStyleId}
        selectedOccasionId={selectedOccasionId}
        isAnalyzed={isAnalyzedFilter}
        onCategorySelect={setCategoryFilter}
        onSeasonSelect={setSeasonFilter}
        onStyleSelect={setStyleFilter}
        onOccasionSelect={setOccasionFilter}
        onAnalyzedToggle={setAnalyzedFilter}
        onClearFilters={clearFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
  },
  filterButton: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  itemCountContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  itemCountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AllWardrobeScreen;
