import React, { useState } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Header } from "../components/common/Header";
import { OutfitActionButtons } from "../components/outfit/OutfitActionButtons";
import { OutfitCalendar } from "../components/outfit/OutfitCalendar";
import { OutfitBookSection } from "../components/outfit/OutfitBookSection";
import { AllOutfitsSection } from "../components/outfit/AllOutfitsSection";

const OutfitScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Mock data for outfits
  const mockOutfits = [
    {
      id: "1",
      items: [
        "https://via.placeholder.com/150/0000FF/FFFFFF?text=Top",
        "https://via.placeholder.com/150/000000/FFFFFF?text=Bottom",
      ],
      name: "Casual Outfit",
    },
  ];

  const mockAllOutfits = [
    {
      id: "1",
      items: [
        "https://via.placeholder.com/150/0000FF/FFFFFF?text=Top",
        "https://via.placeholder.com/150/000000/FFFFFF?text=Bottom",
      ],
      favoriteCount: 0,
    },
  ];

  const handleCreateOutfit = () => {
    console.log("Create outfit");
    // Navigate to outfit builder
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
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Fetch data here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
          outfits={mockOutfits}
          onCreateOutfit={handleCreateOutfit}
          onViewOutfit={handleViewOutfit}
        />

        {/* All Outfits Section */}
        <AllOutfitsSection
          outfits={mockAllOutfits}
          onViewOutfit={handleViewOutfit}
        />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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

export default OutfitScreen;
