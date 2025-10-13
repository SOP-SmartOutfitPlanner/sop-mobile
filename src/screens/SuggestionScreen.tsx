import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/common";
import {
  MainSuggestionCard,
  QuickPreferences,
  WeatherContext,
} from "../components/suggestion";

const SuggestionScreen = ({ navigation }: any) => {
  const [goal, setGoal] = useState("Casual");
  const [occasion, setOccasion] = useState("Work");
  const [season, setSeason] = useState("Auto (Weather)");
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  // Mock data
  const mainSuggestion = {
    items: [
      {
        name: "Classic White Shirt",
        image: require("../../assets/adaptive-icon.png"),
      },
      {
        name: "Dark Wash Jeans",
        image: require("../../assets/adaptive-icon.png"),
      },
      {
        name: "Black Ankle Boots",
        image: require("../../assets/adaptive-icon.png"),
      },
    ],
    mainImage: require("../../assets/adaptive-icon.png"),
    match: 92,
    style: "Casual",
    weather: "Weather-ready",
  };

  // Handlers
  const handlePreviousSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 2));
  };

  const handleNextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const handleSave = () => {
    Alert.alert("Saved", "Outfit saved to your favorites!");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share outfit with friends");
  };

  const handleGoalPress = () => {
    Alert.alert("Goal Selection", "Select your goal");
  };

  const handleOccasionPress = () => {
    Alert.alert("Occasion Selection", "Select occasion");
  };

  const handleSeasonPress = () => {
    Alert.alert("Season Selection", "Select season");
  };

  const handleGenerate = () => {
    Alert.alert("Generate Outfit", "Generating new outfit suggestion...");
  };

  const handleWeatherRefresh = () => {
    Alert.alert("Refresh", "Updating weather information...");
  };

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "You have new notifications");
  };

  const handleMessagePress = () => {
    Alert.alert("Messages", "No new messages");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Outfit Suggestion"
        showBackButton={false}
        showNotification={true}
        showMessage={true}
        showProfile={true}
        onNotificationPress={handleNotificationPress}
        onMessagePress={handleMessagePress}
        onProfilePress={handleProfilePress}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <MainSuggestionCard
          items={mainSuggestion.items}
          mainImage={mainSuggestion.mainImage}
          matchPercentage={mainSuggestion.match}
          style={mainSuggestion.style}
          weather={mainSuggestion.weather}
          currentIndex={currentSuggestionIndex}
          totalSuggestions={3}
          onPrevious={handlePreviousSuggestion}
          onNext={handleNextSuggestion}
          onSave={handleSave}
          onShare={handleShare}
        />

        <QuickPreferences
          goal={goal}
          occasion={occasion}
          season={season}
          onGoalPress={handleGoalPress}
          onOccasionPress={handleOccasionPress}
          onSeasonPress={handleSeasonPress}
          onGenerate={handleGenerate}
        />

        <WeatherContext
          temperature={22}
          description="Perfect temperature for this outfit combination. Layer-friendly for temperature changes."
          condition="Partly Cloudy"
          onRefresh={handleWeatherRefresh}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SuggestionScreen;
