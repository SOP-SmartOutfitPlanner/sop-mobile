import React, { useState } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Text } from "react-native";
import { Header } from "../components/common/Header";
import { OutfitActionButtons } from "../components/outfit/OutfitActionButtons";
import { OutfitCalendar } from "../components/outfit/OutfitCalendar";
import { OutfitBookSection } from "../components/outfit/OutfitBookSection";
import { AllOutfitsSection } from "../components/outfit/AllOutfitsSection";
import NotificationModal from "../components/notification/NotificationModal";
import { useOutfits } from "../hooks/outfit/useOutfits";

const OutfitScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Use custom hook for outfit management
  const {
    outfits,
    favoriteOutfits,
    loading,
    isRefreshing,
    createOutfit,
    toggleFavorite,
    handleRefresh,
    showError,
    showSuccess,
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

  const transformedAllOutfits = outfits.map((outfit) => ({
    id: outfit.id.toString(),
    items: outfit.items.map((item) => item.imgUrl),
    name: outfit.name,
    favoriteCount: outfit.isFavorite ? 1 : 0,
  }));

  const handleCreateOutfit = () => {
    console.log("Create outfit");
    // Navigate to outfit builder
    // You can implement navigation to outfit creation screen here
  };

  const handleAddToCalendar = () => {
    console.log("Add to calendar");
  };

  const handleCreateSuggestionList = () => {
    console.log("Create suggestion list");
  };

  const handleViewOutfit = (outfit: any) => {
    console.log("View outfit:", outfit);
  };

  const handleViewCalendar = () => {
    console.log("View full calendar");
    // Navigate to calendar screen
  };

  const handleBackPress = () => {
    // Handle back
  };

  const handleNotificationPress = () => {
    // Handle notification
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
        />

        {/* All Outfits Section */}
        <AllOutfitsSection
          outfits={transformedAllOutfits}
          onViewOutfit={handleViewOutfit}
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
