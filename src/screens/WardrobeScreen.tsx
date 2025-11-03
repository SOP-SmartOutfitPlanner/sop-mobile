import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from "react-native";
import { Header } from "../components/common/Header";
import { GuestPrompt } from "../components/notification/GuestPrompt";
import { Item } from "../types/item";
import { useWardrobe } from "../hooks/useWardrobe";
import { useAuth } from "../hooks/auth";
import { WardrobeActionButtons } from "../components/wardrobe/WardrobeActionButtons";
import { WardrobeSection } from "../components/wardrobe/WardrobeSection";
import { EmptyWardrobe } from "../components/wardrobe/EmptyWardrobe";
import { WardrobeItemGrid } from "../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { FilterModal } from "../components/wardrobe/FilterModal";
import { AddItemModal } from "../components/wardrobe/modal/AddItemModal";
import { useAIDetection } from "../contexts/AIDetectionContext";

const WardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [outfitBuilderItem, setOutfitBuilderItem] = useState<Item | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const { isGuest, isAuthenticated } = useAuth();
  const { shouldOpenModal, setShouldOpenModal, hasCompletedDetection } = useAIDetection();
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
    editItem,
    deleteItem,
  } = useWardrobe();

  // Listen for AI detection completion and reopen modal when banner is tapped
  useEffect(() => {
    if (shouldOpenModal && hasCompletedDetection) {
      setIsAddItemModalOpen(true);
      setShouldOpenModal(false); // Reset flag
    }
  }, [shouldOpenModal, hasCompletedDetection, setShouldOpenModal]);

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

  // Mock some favorites for demo
  const favoriteItems = items.slice(0, Math.min(4, items.length));

  const handleViewFavorites = () => {
    // Navigate to favorites screen
    console.log("View favorites");
  };

  const handleViewFrequency = () => {
    // Navigate to frequency screen
    console.log("View frequency");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Tủ đồ"
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Action Buttons */}
        <WardrobeActionButtons
          onAddItem={() => setIsAddItemModalOpen(true)}
          onViewFavorites={handleViewFavorites}
          onViewFrequency={handleViewFrequency}
        />

        {/* Wardrobe Section */}
        <WardrobeSection
          title="Wardrobe"
          showViewMore={items.length > 0}
          viewMoreText="View All"
          onViewMore={() => navigation.navigate("AllWardrobe")}
        >
          {items.length === 0 ? (
            <EmptyWardrobe onCreateWardrobe={() => setIsAddItemModalOpen(true)} />
          ) : (
            <WardrobeItemGrid
              items={items.slice(0, 3)}
              onItemClick={handleItemClick}
              columns={3}
            />
          )}
        </WardrobeSection>

        {/* Favorites Section */}
        {favoriteItems.length > 0 && (
          <WardrobeSection
            title="Favorites list"
            showViewMore
            viewMoreText="View All"
            onViewMore={handleViewFavorites}
          >
            <WardrobeItemGrid
              items={favoriteItems.slice(0, 3)}
              onItemClick={handleItemClick}
            />
          </WardrobeSection>
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
    paddingTop: 16,
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
