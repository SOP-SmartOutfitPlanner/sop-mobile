import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Header } from "../components/common/Header";
import { GuestPrompt } from "../components/notification/GuestPrompt";
import { Item } from "../types/item";
import { useWardrobe } from "../hooks/useWardrobe";
import { WardrobeActionButtons } from "../components/wardrobe/WardrobeActionButtons";
import { WardrobeSection } from "../components/wardrobe/WardrobeSection";
import { EmptyWardrobe } from "../components/wardrobe/EmptyWardrobe";
import { WardrobeItemGrid } from "../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { FilterModal } from "../components/wardrobe/FilterModal";
import { AddItemModal } from "../components/wardrobe/modal/AddItemModal";
import { EditItemModal } from "../components/wardrobe/modal/EditItemModal";
import { useAIDetection } from "../contexts/AIDetectionContext";

const WardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const { shouldOpenModal, setShouldOpenModal, hasCompletedDetection, createdItem, clearDetection, setOnItemCreated } = useAIDetection();
  const {
    items,
    selectedFilters,
    toggleFilter,
    clearFilters,
    loading,
    isRefreshing,
    handleRefresh,
    refetch,
    editItem,
    deleteItem,
  } = useWardrobe();

  // Memoize the callback to prevent infinite loop
  const handleItemCreated = useCallback(() => {
    console.log('🔄 Refreshing wardrobe after item creation...');
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

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleUseInOutfit = (item: Item) => {
    setSelectedItem(null);
    // TODO: Navigate to outfit builder with selected item
    console.log("Use in outfit:", item.name);
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
              columns={3}
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
        onSave={() => setIsAddItemModalOpen(false)}
      />

      <EditItemModal
        visible={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
          clearDetection(); // Clear AI detection data
        }}
        onSave={async () => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
          clearDetection(); // Clear AI detection data
          await handleRefresh(); // Refresh wardrobe after editing item
        }}
        item={selectedItem}
        editItem={editItem}
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
