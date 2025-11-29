import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Text } from "react-native";
import { Header } from "../components/common/Header";
import { OutfitActionButtons } from "../components/outfit/OutfitActionButtons";
import { OutfitCalendar } from "../components/outfit/OutfitCalendar";
import { OutfitBookSection } from "../components/outfit/OutfitBookSection";
import { FavoriteOutfitsSection } from "../components/outfit/FavoriteOutfitsSection";
import { OutfitDetailModal } from "../components/outfit/OutfitDetailModal";
import { CreateOutfitModal } from "../components/outfit/modal/CreateOutfitModal";
import { EditOutfitModal } from "../components/outfit/modal/EditOutfitModal";
import NotificationModal from "../components/notification/NotificationModal";
import { useOutfits } from "../hooks/outfit/useOutfits";
import { Outfit } from "../types/outfit";

const OutfitScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  
  // Use custom hook for outfit management
  const {
    outfits,
    favoriteOutfits,
    loading,
    isRefreshing,
    createOutfit,
    editOutfit,
    toggleFavorite,
    deleteOutfit,
    handleRefresh,
    showError,
    visible,
    config,
    hideNotification,
  } = useOutfits();

  // Mock data for calendar
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = -1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
      const dayOfWeek = dayNames[date.getDay()];
      
      days.push({
        dayOfWeek,
        date: `${date.getDate()} thg ${date.getMonth() + 1}`,
        fullDate: date,
        temperature: i >= 0 ? `${29 + i}° ${23 + i}°` : undefined,
        weather: i === 0 ? "rain" : i === 1 ? "rain" : "cloud",
        isToday: i === 0,
      });
    }
    
    return days;
  };

  // Transform outfits for components
  const transformedOutfitsForBook = outfits.slice(0, 5).map((outfit) => ({
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

  const handleCreateOutfit = () => {
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
        prev && prev.id === outfitId ? { ...prev, isFavorite: !prev.isFavorite } : prev
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
    console.log("View full calendar");
    // Navigate to calendar screen
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
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Action Buttons */}
        <OutfitActionButtons
          onCreateOutfit={handleCreateOutfit}
          onAddToCalendar={handleAddToCalendar}
        />

        {/* Calendar Section */}
        <OutfitCalendar
          days={generateCalendarDays()}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onViewAll={handleViewCalendar}
        />

        {/* Outfit Book Section */}
        <OutfitBookSection
          outfits={transformedOutfitsForBook}
          onCreateOutfit={handleCreateOutfit}
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

      {/* Notification Modal */}
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

      <OutfitDetailModal
        visible={isDetailVisible}
        outfit={selectedOutfit}
        onClose={handleCloseDetail}
        onToggleFavorite={handleFavoriteToggle}
        onDeleteOutfit={handleDeleteOutfit}
        onEditOutfit={handleEditOutfit}
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
});

export default OutfitScreen;
