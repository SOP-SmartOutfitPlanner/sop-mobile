import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../components/common/Header";
import { Item } from "../types/item";
import { useWardrobe } from "../hooks/useWardrobe";
import { WardrobeActionButtons } from "../components/wardrobe/WardrobeActionButtons";
import { WardrobeSection } from "../components/wardrobe/WardrobeSection";
import { EmptyWardrobe } from "../components/wardrobe/EmptyWardrobe";
import { WardrobeItemGrid } from "../components/wardrobe/WardrobeItemGrid";
import { WardrobeLoadingGrid } from "../components/wardrobe/WardrobeLoadingGrid";
import { ItemDetailModal } from "../components/wardrobe/ItemDetailModal";
import { AddItemModal } from "../components/wardrobe/modal/AddItemModal";
import { EditItemModal } from "../components/wardrobe/modal/EditItemModal";
import { useAIDetection } from "../contexts/AIDetectionContext";
import { useAuth } from "../hooks/auth";

const WardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);

  const { user } = useAuth(); // Track auth state
  const { shouldOpenModal, setShouldOpenModal, hasCompletedDetection, createdItem, clearDetection, setOnItemCreated } = useAIDetection();
  const {
    items,
    loading,
    isRefreshing,
    handleRefresh,
    refetch,
    editItem,
    deleteItem,
  } = useWardrobe();

  // Refetch items when screen is focused (handles login/logout)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Screen focused, refetching wardrobe...');
      refetch();
    }, [refetch])
  );

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

  // Memoize callbacks to prevent re-renders
  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleUseInOutfit = useCallback((item: Item) => {
    setSelectedItem(null);
    // TODO: Navigate to outfit builder with selected item
    console.log("Use in outfit:", item.name);
  }, []);

  const handleViewFavorites = useCallback(() => {
    // Navigate to favorites screen
    console.log("View favorites");
  }, []);

  const handleViewSuggestion = useCallback(() => {
    navigation.navigate("Suggestion");
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  // Empty handlers for Header props (not used in this screen)
  const handleBackPress = useCallback(() => {}, []);
  const handleNotificationPress = useCallback(() => {}, []);
  const handleMessagePress = useCallback(() => {}, []);

  // Memoize favorites to avoid recalculation
  const favoriteItems = useMemo(
    () => items.slice(0, Math.min(4, items.length)),
    [items]
  );

  // Memoize displayed items
  const displayedItems = useMemo(
    () => items.slice(0, 3),
    [items]
  );

  const displayedFavorites = useMemo(
    () => favoriteItems.slice(0, 3),
    [favoriteItems]
  );

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
    console.log('✅ Items uploaded successfully, refreshing wardrobe...');
    await refetch(); // Refresh wardrobe items
  }, [refetch]);

  const handleCloseEditItem = useCallback(() => {
    setIsEditItemModalOpen(false);
    setSelectedItem(null);
    clearDetection(); // Clear AI detection data
  }, [clearDetection]);

  const handleSaveEditItem = useCallback(async () => {
    setIsEditItemModalOpen(false);
    setSelectedItem(null);
    clearDetection(); // Clear AI detection data
    await handleRefresh(); // Refresh wardrobe after editing item
  }, [clearDetection, handleRefresh]);

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
          onViewSuggestion={handleViewSuggestion}
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
              items={displayedItems}
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
              items={displayedFavorites}
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

      <AddItemModal
        visible={isAddItemModalOpen}
        onClose={handleCloseAddItem}
        onSave={handleSaveAddItem}
        onSuccess={handleSuccessAddItem}
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
  bottomSpacing: {
    height: 80,
  },
});

export default WardrobeScreen;
