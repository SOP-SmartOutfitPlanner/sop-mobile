import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../components/common/Header";
import { GuestPrompt } from "../components/common/GuestPrompt";
import { Item } from "../types/item";
import {
  mockWardrobeGoals,
  mockWardrobeStats,
  mockTypeDistribution,
  mockPopularColors,
  mockMostWornItems,
} from "../hooks/mockData";
import { useWardrobe } from "../hooks/useWardrobe";
import { useAuth } from "../hooks/auth";
import { WardrobeControls } from "../components/wardrobe/WardrobeHeader";
import { WardrobeItemGrid } from "../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { OutfitBuilderModal } from "../components/wardrobe/OutfitBuilderModal";
import { FilterModal } from "../components/wardrobe/FilterModal";
import { AddItemModal } from "../components/wardrobe/AddItemModal";
import { WardrobeGoals } from "../components/wardrobe/WardrobeGoals";
import { WardrobeStats } from "../components/wardrobe/WardrobeStats";
import { TypeDistribution } from "../components/wardrobe/TypeDistribution";
import { MostWorn } from "../components/wardrobe/MostWorn";

type ViewMode = "grid" | "list";

const WardrobeScreen = ({ navigation }: any) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [outfitBuilderItem, setOutfitBuilderItem] = useState<Item | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const { isGuest, isAuthenticated } = useAuth();
  const {
    items,
    allItems,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    toggleFilter,
    clearFilters,
    loading,
    isRefreshing,
    handleRefresh,
    error,
    refetch,
  } = useWardrobe();

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleUseInOutfit = (item: Item) => {
    setSelectedItem(null);
    setOutfitBuilderItem(item);
  };

  const handleBackPress = () => {
    // Handle navigation back if needed
  };

  const handleNotificationPress = () => {
    // Handle notification press
  };

  const handleMessagePress = () => {
    // Handle message press
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Wardrobe"
          showBackButton={false}
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
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
        onMessagePress={handleMessagePress}
        onProfilePress={handleProfilePress}
      />

      {/* Wardrobe Controls */}
      <WardrobeControls
        itemCount={items.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilters={selectedFilters}
        onFilterPress={() => setIsFilterModalOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Items Grid */}
        <WardrobeItemGrid
          items={items}
          viewMode={viewMode}
          onItemClick={handleItemClick}
        />

        {/* Wardrobe Sections */}
        <View style={styles.sectionsContainer}>
          <WardrobeGoals goals={mockWardrobeGoals} />
          <WardrobeStats stats={mockWardrobeStats} />
          <TypeDistribution
            typeData={mockTypeDistribution}
            colorData={mockPopularColors}
          />
          <MostWorn items={mockMostWornItems} />
        </View>

        {/* Bottom spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB for adding items */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Check if user is authenticated (has valid token)
          if (!isAuthenticated) {
            setShowGuestPrompt(true);
          } else {
            setIsAddItemModalOpen(true);
          }
        }}
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
        onSave={async () => {
          setIsAddItemModalOpen(false);
          await handleRefresh(); // Refresh wardrobe after adding item
        }}
      />

      <GuestPrompt
        visible={showGuestPrompt}
        onClose={() => setShowGuestPrompt(false)}
        onLogin={() => {
          setShowGuestPrompt(false);
          navigation.navigate("Auth", { screen: "Login" });
        }}
        feature="thêm item vào tủ đồ"
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
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
  sectionsContainer: {
    marginTop: 20,
    gap: 20,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 100,
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
