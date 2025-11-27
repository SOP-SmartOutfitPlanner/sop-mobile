import React, { useState, useMemo } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
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

  const activeFiltersCount = useMemo(
    () =>
      [
        selectedCategoryId,
        selectedSeasonId,
        selectedStyleId,
        selectedOccasionId,
        isAnalyzedFilter,
      ].filter((filter) => filter !== undefined).length,
    [
      selectedCategoryId,
      selectedSeasonId,
      selectedStyleId,
      selectedOccasionId,
      isAnalyzedFilter,
    ]
  );

  const analyzedCount = useMemo(
    () => items.filter((item) => item.isAnalyzed).length,
    [items]
  );

  const frequentCount = useMemo(
    () =>
      items.filter((item) => {
        const freq = Number(item.frequencyWorn || 0);
        return freq > 5;
      }).length,
    [items]
  );

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
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={["#1d4ed8", "#0f172a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroTitle}>Entire Wardrobe</Text>
                <Text style={styles.heroSubtitle}>
                  Filter, analyze, and manage every AI-tagged piece.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.heroBack}
                onPress={handleBackPress}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={18} color="#e0f2fe" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{items.length}</Text>
                <Text style={styles.heroStatLabel}>Total</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{analyzedCount}</Text>
                <Text style={styles.heroStatLabel}>Analyzed</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{frequentCount}</Text>
                <Text style={styles.heroStatLabel}>Most worn</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search in wardrobe..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="options-outline" size={20} color="#0f172a" />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.itemCountContainer}>
          <Text style={styles.itemCountText}>
            {items.length} curated items
          </Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>

        {/* Analyze Items Button */}
        <AnalyzeItemsButton items={items} onAnalysisComplete={handleRefresh} />

        {/* Items Grid */}
        {items.length > 0 ? (
          <WardrobeItemGrid
            items={items}
            onItemClick={handleItemClick}
            columns={2}
          />
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
    backgroundColor: "#030617",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    gap: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.85)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#e2e8f0",
  },
  filterButton: {
    width: 60,
    height: 60,
    backgroundColor: "#38bdf8",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "bold",
  },
  itemCountContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCountText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  clearFiltersText: {
    fontSize: 13,
    color: "#94a3b8",
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
  heroWrapper: {
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 20,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "rgba(226,232,240,0.85)",
    marginTop: 6,
    fontSize: 13,
  },
  heroBack: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(224,242,254,0.35)",
    backgroundColor: "rgba(15,23,42,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroStat: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
    backgroundColor: "rgba(15,23,42,0.35)",
    paddingVertical: 14,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  heroStatLabel: {
    fontSize: 12,
    color: "rgba(226,232,240,0.8)",
    marginTop: 4,
  },
});

export default AllWardrobeScreen;
