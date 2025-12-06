import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../components/common/Header";
import { Item } from "../types/item";
import { useWardrobe } from "../hooks/useWardrobe";
import { WardrobeSection } from "../components/wardrobe/WardrobeSection";
import { EmptyWardrobe } from "../components/wardrobe/EmptyWardrobe";
import { WardrobeItemGrid } from "../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { AddItemModal } from "../components/wardrobe/modal/AddItemModal";
import { EditItemModal } from "../components/wardrobe/modal/EditItemModal";
import { FilterModal } from "../components/wardrobe/FilterModal";
import { AnalyzeItemsButton } from "../components/wardrobe/AnalyzeItemsButton";
import { useAIDetection } from "../contexts/AIDetectionContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getUserId } from "../services/api/apiClient";

const WardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { shouldOpenModal, setShouldOpenModal, hasCompletedDetection, createdItem, clearDetection, setOnItemCreated } = useAIDetection();
  const {
    items,
    totalCount,
    searchQuery,
    setSearchQuery,
    loading,
    isRefreshing,
    handleRefresh,
    loadMore,
    hasMorePages,
    isLoadingMore,
    refetch,
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
  } = useWardrobe({ takeAll: false, pageSize: 10 });

  // Track if this is the first mount to avoid duplicate API calls
  const isFirstMount = useRef(true);

  // Refetch items when screen is focused (but not on first mount)
  // This handles cases like login/logout or returning from other screens
  useFocusEffect(
    useCallback(() => {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        // Skip refetch on first mount - useWardrobe already fetches on mount
        return;
      }
      refetch();
    }, [refetch])
  );

  const handleItemCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  // Set callback to refresh wardrobe when item is created
  useEffect(() => {
    setOnItemCreated(handleItemCreated);

    // Cleanup
    return () => {
      setOnItemCreated(null);
    };
  }, [setOnItemCreated, handleItemCreated]);

  // Listen for AI detection completion and open EditItemModal when banner is tapped
  useEffect(() => {
    if (shouldOpenModal && hasCompletedDetection && createdItem) {
      setSelectedItem(createdItem); // Set the created item as selected
      setIsEditItemModalOpen(true); // Open edit modal
      setShouldOpenModal(false); // Reset flag
    }
  }, [shouldOpenModal, hasCompletedDetection, createdItem, setShouldOpenModal]);

  // Memoize callbacks to prevent re-renders
  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleUseInOutfit = useCallback((item: Item) => {
    setSelectedItem(null);
    // TODO: Navigate to outfit builder with selected item
  }, []);


  const handleProfilePress = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  // Empty handlers for Header props (not used in this screen)
  const handleBackPress = useCallback(() => {}, []);
  const handleNotificationPress = useCallback(() => {
    navigation.navigate("Notifications");
  }, [navigation]);

  const analyzedCount = useMemo(
    () => items.filter((item) => item.isAnalyzed).length,
    [items]
  );

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

  const totalItems = totalCount || items.length;


  // Memoize modal handlers
  const handleCloseItemDetail = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleCloseAddItem = useCallback(() => {
    setIsAddItemModalOpen(false);
  }, []);

  const handleSaveAddItem = useCallback(() => {
    setIsAddItemModalOpen(false);
  }, []);

  const handleSuccessAddItem = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    await refetch();
  }, [refetch]);

  const handleCloseEditItem = useCallback(() => {
    setIsEditItemModalOpen(false);
    setSelectedItem(null);
    clearDetection(); // Clear AI detection data
  }, [clearDetection]);

  const handleSaveEditItem = useCallback(async () => {
    setIsEditItemModalOpen(false);
    setSelectedItem(null);
    clearDetection();
    await handleRefresh();
  }, [clearDetection, handleRefresh]);

  const handleOpenFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const handleOpenAddItemModal = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    setIsAddItemModalOpen(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, [setSearchQuery]);

  const handleEmptyWardrobeCreate = useCallback(async () => {
    const userId = await getUserId();
    if (userId) {
      setIsAddItemModalOpen(true);
    } else {
      navigation.navigate("Auth", { screen: "Login" });
    }
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Wardrobe"
          showBackButton={false}
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
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
        title="Wardrobe"
        showBackButton={false}
        onBackPress={handleBackPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
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
            colors={["#1e3a8a", "#172554"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <View>
                <Text style={styles.heroBadge}>Wardrobe AI</Text>
                <Text style={styles.heroGreeting}>Hi there,</Text>
                <Text style={styles.heroSubtitle}>
                  Curate today’s outfit with smart insights.
                </Text>
              </View>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatCard}>
                <Text style={styles.heroStatNumber}>{items.length}</Text>
                <Text style={styles.heroStatLabel}>Items</Text>
              </View>
              <View style={styles.heroStatCard}>
                <Text style={styles.heroStatNumber}>{analyzedCount}</Text>
                <Text style={styles.heroStatLabel}>Analyzed</Text>
              </View>
            </View>

            
          </LinearGradient>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your wardrobe..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleOpenFilterModal}
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

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleOpenAddItemModal}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemCountContainer}>
          <Text style={styles.itemCountText}>
            Showing {items.length} / {totalItems} items
          </Text>
          {activeFiltersCount > 0 && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
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
            <EmptyWardrobe onCreateWardrobe={handleEmptyWardrobeCreate} />
          </View>
        )}

        {/* Load more */}
        {hasMorePages && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={isLoadingMore}
            activeOpacity={0.85}
          >
            {isLoadingMore ? (
              <>
                <ActivityIndicator color="#0f172a" size="small" />
                <Text style={styles.loadMoreText}>Loading...</Text>
              </>
            ) : (
              <Text style={styles.loadMoreText}>Load more</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <ItemDetailModal
        visible={!!selectedItem}
        onClose={handleCloseItemDetail}
        item={selectedItem}
        onUseInOutfit={handleUseInOutfit}
        onRefresh={handleRefresh}
        editItem={editItem}
        deleteItem={deleteItem}
      />

      <AddItemModal
        visible={isAddItemModalOpen}
        onClose={handleCloseAddItem}
        onSave={handleSaveAddItem}
        onSuccess={handleSuccessAddItem}
      />

      <EditItemModal
        visible={isEditItemModalOpen}
        onClose={handleCloseEditItem}
        onSave={handleSaveEditItem}
        item={selectedItem}
        editItem={editItem}
      />

      <FilterModal
        visible={isFilterModalOpen}
        onClose={handleCloseFilterModal}
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
    paddingTop: 16,
    paddingBottom: 32,
    gap: 24,
  },
  heroWrapper: {
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroBadge: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontSize: 13,
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(14, 116, 144, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(224,242,254,0.4)",
  },
  heroStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(15,23,42,0.4)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
  },
  heroStatNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  heroStatLabel: {
    color: "rgba(226,232,240,0.8)",
    fontSize: 12,
    marginTop: 4,
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
    gap: 8,
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
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#38bdf8",
    justifyContent: "center",
    alignItems: "center",
  },
  itemCountContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
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
  loadMoreButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  loadMoreText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  emptyContainer: {
    paddingHorizontal: 16,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default WardrobeScreen;
