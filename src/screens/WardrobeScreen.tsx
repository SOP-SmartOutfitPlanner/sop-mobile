import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
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
import { useAIDetection } from "../contexts/AIDetectionContext";
import { useAuth } from "../hooks/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const WardrobeScreen = ({ navigation }: any) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // const { user } = useAuth(); 
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

  const favoriteItems = useMemo(
    () => items.slice(0, Math.min(4, items.length)),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [items, searchQuery]);

  const analyzedCount = useMemo(
    () => items.filter((item) => item.isAnalyzed).length,
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
              <View style={styles.heroStatCard}>
                <Text style={styles.heroStatNumber}>
                  {favoriteItems.length}
                </Text>
                <Text style={styles.heroStatLabel}>Favorites</Text>
              </View>
            </View>

            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.heroActionButton}
                onPress={handleViewFavorites}
              >
                <Ionicons name="heart-outline" size={16} color="#e0f2fe" />
                <Text style={styles.heroActionText}>Favorites</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroActionButton}
                onPress={handleViewSuggestion}
              >
                <Ionicons name="sparkles-outline" size={16} color="#e0f2fe" />
                <Text style={styles.heroActionText}>Ideas</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchText}
              placeholder="Search your wardrobe..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#e0f2fe" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddItemModalOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Wardrobe Section */}
        <WardrobeSection
          title="Wardrobe"
          showViewMore={filteredItems.length > 4}
          viewMoreText="View All"
          onViewMore={() => navigation.navigate("AllWardrobe")}
        >
          {filteredItems.length === 0 ? (
            <EmptyWardrobe onCreateWardrobe={() => navigation.navigate("Auth", { screen: "Login" })} />
          ) : (
            <WardrobeItemGrid
              items={filteredItems}
              onItemClick={handleItemClick}
              columns={2}
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
              columns={2}
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
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  heroActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(224,242,254,0.3)",
    backgroundColor: "rgba(15,23,42,0.2)",
  },
  heroActionText: {
    color: "#e0f2fe",
    fontWeight: "600",
    fontSize: 13,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  searchText: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(224,242,254,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#38bdf8",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacing: {
    height: 80,
  },
});

export default WardrobeScreen;
