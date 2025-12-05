import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../components/common/Header";
import { OutfitActionButtons } from "../components/outfit/OutfitActionButtons";
import { OutfitSearchBar } from "../components/outfit/OutfitSearchBar";
import {
  OutfitFilterModal,
  FilterOption,
  SortOption,
} from "../components/outfit/OutfitFilterModal";
import { FavoriteOutfitsSection } from "../components/outfit/FavoriteOutfitsSection";
import { OutfitDetailModal } from "../components/outfit/OutfitDetailModal";
import { CreateOutfitModal } from "../components/outfit/modal/CreateOutfitModal";
import { EditOutfitModal } from "../components/outfit/modal/EditOutfitModal";
import NotificationModal from "../components/notification/NotificationModal";
import { useOutfits } from "../hooks/outfit/useOutfits";
import { useCalendar } from "../hooks/calendar/useCalendar";
import { Outfit } from "../types/outfit";
import { OutfitBookSection } from "@/components/outfit";
import { WeeklyCalendar } from "../components/calendar/WeeklyCalendar";
import { MonthlyCalendar } from "../components/calendar/MonthlyCalendar";
import { CalendarDayDetailModal } from "../components/calendar/CalendarDayDetailModal";
import { getUserId } from "../services/api/apiClient";
import { AnimatedBackground } from "@/components/common";

const OutfitScreen = ({ navigation, route }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isCalendarDayDetailVisible, setIsCalendarDayDetailVisible] =
    useState(false);
  const [isMonthlyCalendarVisible, setIsMonthlyCalendarVisible] =
    useState(false);
  const [userOccasions, setUserOccasions] = useState<any[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>("all");
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");

  // Use custom hook for outfit management
  const {
    outfits,
    favoriteOutfits,
    metadata,
    loading,
    loadingMore,
    isRefreshing,
    createOutfit,
    editOutfit,
    toggleFavorite,
    deleteOutfit,
    handleRefresh,
    loadMoreOutfits,
    showError,
    visible,
    config,
    hideNotification,
  } = useOutfits();

  // Use calendar hook
  const {
    useOutfitToday,
    fetchCalendarEntries,
    calendarEntries,
    visible: calendarNotificationVisible,
    config: calendarNotificationConfig,
    hideNotification: hideCalendarNotification,
  } = useCalendar();

  // State to track calendar entries for CalendarDayDetailModal
  const [localCalendarEntries, setLocalCalendarEntries] =
    useState(calendarEntries);

  // Update local state when calendarEntries from hook changes
  useEffect(() => {
    setLocalCalendarEntries(calendarEntries);
  }, [calendarEntries]);

  // Fetch calendar entries and user occasions
  const fetchCalendarData = useCallback(async () => {
    const userId = await getUserId();

    if (!userId) {
      console.log("No userId found, skipping data fetch");
      // Clear data when no userId but stay on current screen
      setUserOccasions([]);
      return;
    }

    // Fetch all calendar entries to ensure we have complete data
    await fetchCalendarEntries({ takeAll: true });

    // Fetch user occasions
    try {
      const { CalenderAPI } = await import("../services/endpoint/calendar");
      const today = new Date();
      const response = await CalenderAPI.getUserOccasions({
        PageIndex: 1,
        PageSize: 100,
        takeAll: true,
        Year: today.getFullYear(),
        Month: today.getMonth() + 1,
      });
      if (response.statusCode === 200 && response.data?.data) {
        setUserOccasions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user occasions:", error);
    }
  }, [fetchCalendarEntries]);

  // Fetch on mount
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Fetch when screen is focused (to refresh data after navigation back)
  useFocusEffect(
    useCallback(() => {
      fetchCalendarData();
      
      // Check if we should open create modal from navigation params
      const params = route?.params as any;
      if (params?.openCreateModal) {
        // Use setTimeout to ensure screen is fully focused
        setTimeout(() => {
          setIsCreateModalVisible(true);
        }, 100);
        // Clear the param to prevent reopening on next focus
        navigation.setParams({ openCreateModal: undefined });
      }
    }, [fetchCalendarData, route?.params, navigation])
  );

  // Filter and sort outfits
  const filteredAndSortedOutfits = useMemo(() => {
    let filtered = [...outfits];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (outfit) =>
          outfit.name?.toLowerCase().includes(query) ||
          outfit.description?.toLowerCase().includes(query)
      );
    }

    // Apply favorites filter
    if (showFavoritesOnly || currentFilter === "favorites") {
      filtered = filtered.filter((outfit) => outfit.isFavorite);
    }

    // Apply recent filter
    if (currentFilter === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter((outfit) => {
        const createdDate = new Date(outfit.createdDate);
        return createdDate >= sevenDaysAgo;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (currentSort) {
        case "newest":
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
          );
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "items":
          return b.items.length - a.items.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [outfits, searchQuery, showFavoritesOnly, currentFilter, currentSort]);

  // Transform outfits for components
  const transformedOutfitsForBook = filteredAndSortedOutfits
    .slice(0, 5)
    .map((outfit) => ({
      id: outfit.id.toString(),
      items: outfit.items.map((item) => item.imgUrl),
      name: outfit.name,
    }));

  const transformedFavoriteOutfits = favoriteOutfits.map((outfit) => ({
    id: outfit.id.toString(),
    items: outfit.items.map((item) => item.imgUrl),
    name: outfit.name,
    favoriteCount: outfit.isFavorite ? 1 : 0,
  }));

  const allOutfitPool = useMemo(() => {
    const map = new Map<number, Outfit>();
    [...outfits, ...favoriteOutfits].forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [outfits, favoriteOutfits]);

  const handleCreateOutfit = async () => {
    const userId = await getUserId();

    if (!userId) {
      console.log("No userId found, cannot create outfit");
      // User stays on current screen, modal won't open
      return;
    }

    setIsCreateModalVisible(true);
  };

  const handleAddToCalendar = () => {
    console.log("Add to calendar");
  };

  const handleCreateSuggestionList = () => {
    console.log("Create suggestion list");
  };

  const handleViewOutfit = (outfitId: string) => {
    const numericId = Number(outfitId);
    const found = allOutfitPool.get(numericId);
    if (found) {
      setSelectedOutfit(found);
      setIsDetailVisible(true);
    } else {
      showError("Unable to find outfit information. Please try again.");
    }
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setSelectedOutfit(null);
  };

  const handleNavigateAllOutfits = () => {
    if (navigation?.navigate) {
      navigation.navigate("AllOutfit");
    }
  };

  const handleFavoriteToggle = async (outfitId: number) => {
    const success = await toggleFavorite(outfitId);
    if (success) {
      setSelectedOutfit((prev) =>
        prev && prev.id === outfitId
          ? { ...prev, isFavorite: !prev.isFavorite }
          : prev
      );
    }
  };

  const handleDeleteOutfit = async (outfitId: number) => {
    const success = await deleteOutfit(outfitId);
    if (success) {
      handleCloseDetail();
    }
  };

  const handleEditOutfit = (outfitId: number) => {
    const outfitToEdit = allOutfitPool.get(outfitId);
    if (outfitToEdit) {
      setEditingOutfit(outfitToEdit);
      setIsEditModalVisible(true);
      setIsDetailVisible(false); // Close detail modal when opening edit
    } else {
      showError("Unable to find outfit information. Please try again.");
    }
  };

  const handleCreateOutfitSuccess = async () => {
    await handleRefresh();
  };

  const handleEditOutfitSuccess = async () => {
    await handleRefresh();
    setEditingOutfit(null);
  };

  const handleViewCalendar = () => {
    setIsMonthlyCalendarVisible(true);
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarDayDetailVisible(true);
  };

  const handleCloseCalendarDayDetail = () => {
    setIsCalendarDayDetailVisible(false);
    setSelectedDate(null);
  };

  const handleCloseMonthlyCalendar = () => {
    setIsMonthlyCalendarVisible(false);
  };

  const handleRefreshCalendar = async () => {
    // Fetch all calendar entries and user occasions to ensure we have the latest data
    // This will update calendarEntries in the hook, which will trigger useEffect above
    await fetchCalendarData();
  };

  const handleBackPress = () => {
    // Handle back
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const handleMessagePress = () => {
    // Handle message
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleFilterApply = (filter: FilterOption, sort: SortOption) => {
    setCurrentFilter(filter);
    setCurrentSort(sort);
    if (filter === "favorites") {
      setShowFavoritesOnly(true);
    } else {
      setShowFavoritesOnly(false);
    }
  };

  // Show loading on first load
  if (loading && outfits.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Outfits"
          showBackButton={false}
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
          onProfilePress={handleProfilePress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading outfits...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground>
        {/* Header */}
        <Header
          title="Outfits"
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Search Bar */}
          <OutfitSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setIsFilterModalVisible(true)}
            onFavoritesPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            showFavoritesOnly={showFavoritesOnly}
          />

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>
              Showing {filteredAndSortedOutfits.length} of {outfits.length}{" "}
              outfits
            </Text>
          </View>

          {/* Action Buttons */}
          <OutfitActionButtons
            onCreateOutfit={handleCreateOutfit}
            onAddToCalendar={handleAddToCalendar}
          />

          {/* Weekly Calendar Section */}
          <WeeklyCalendar
            calendarEntries={localCalendarEntries}
            userOccasions={userOccasions}
            onDayPress={handleDayPress}
            onShowMonthView={handleViewCalendar}
          />

          {/* Outfit Book Section */}
          <OutfitBookSection
            outfits={transformedOutfitsForBook}
            onViewOutfit={handleViewOutfit}
            onViewAllOutfits={handleNavigateAllOutfits}
          />

          {/* Favorite Outfits */}
          <FavoriteOutfitsSection
            outfits={transformedFavoriteOutfits}
            onViewOutfit={handleViewOutfit}
            onViewAll={handleNavigateAllOutfits}
          />

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Notification Modal for Outfits */}
        <NotificationModal
          isVisible={visible}
          type={config.type}
          title={config.title}
          message={config.message}
          confirmText={config.confirmText}
          cancelText={config.cancelText}
          showCancel={config.showCancel}
          onConfirm={config.onConfirm}
          onClose={hideNotification}
        />

        {/* Notification Modal for Calendar */}
        <NotificationModal
          isVisible={calendarNotificationVisible}
          type={calendarNotificationConfig.type}
          title={calendarNotificationConfig.title}
          message={calendarNotificationConfig.message}
          confirmText={calendarNotificationConfig.confirmText}
          cancelText={calendarNotificationConfig.cancelText}
          showCancel={calendarNotificationConfig.showCancel}
          onConfirm={calendarNotificationConfig.onConfirm}
          onClose={hideCalendarNotification}
        />

        <OutfitDetailModal
          visible={isDetailVisible}
          outfit={selectedOutfit}
          onClose={handleCloseDetail}
          onToggleFavorite={handleFavoriteToggle}
          onDeleteOutfit={handleDeleteOutfit}
          onEditOutfit={handleEditOutfit}
          onUseOutfitToday={async (outfitId) => {
            try {
              const today = new Date();
              const result = await useOutfitToday(outfitId, today);
              if (result) {
                // Refresh calendar entries with all data
                await fetchCalendarData();
              }
            } catch (error) {
              console.error("Error using outfit today:", error);
            }
          }}
        />

        <CreateOutfitModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onCreateOutfit={async (data) => {
            const result = await createOutfit(data);
            if (result) {
              handleCreateOutfitSuccess();
            }
            return result;
          }}
        />

        <EditOutfitModal
          visible={isEditModalVisible}
          outfit={editingOutfit}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditingOutfit(null);
          }}
          onEditOutfit={async (id, data) => {
            const result = await editOutfit(id, data);
            if (result) {
              handleEditOutfitSuccess();
              // Update selected outfit if it's the one being edited
              if (selectedOutfit && selectedOutfit.id === id) {
                setSelectedOutfit(result);
              }
            }
            return result;
          }}
        />

        <OutfitFilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApply={handleFilterApply}
          currentFilter={currentFilter}
          currentSort={currentSort}
        />

        {/* Monthly Calendar Modal */}
        <Modal
          visible={isMonthlyCalendarVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleCloseMonthlyCalendar}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Outfit Calendar</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseMonthlyCalendar}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
            >
              <MonthlyCalendar
                calendarEntries={localCalendarEntries}
                onDayPress={(date) => {
                  setSelectedDate(date);
                  setIsMonthlyCalendarVisible(false);
                  setIsCalendarDayDetailVisible(true);
                }}
              />
            </ScrollView>
          </View>
        </Modal>

        {/* Calendar Day Detail Modal */}
        <CalendarDayDetailModal
          visible={isCalendarDayDetailVisible}
          selectedDate={selectedDate}
          onClose={handleCloseCalendarDayDetail}
          calendarEntries={localCalendarEntries}
          outfits={outfits}
          onLoadMoreOutfits={loadMoreOutfits}
          hasMoreOutfits={metadata?.hasNext || false}
          loadingMoreOutfits={loadingMore}
          onRefresh={handleRefreshCalendar}
        />
      </AnimatedBackground>
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
    paddingBottom: 16,
  },
  statsBar: {
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
  },
  statsText: {
    fontSize: 14,
    color: "rgba(226,232,240,0.8)",
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#030617",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.2)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default OutfitScreen;
