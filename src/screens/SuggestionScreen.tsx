import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/common";
import {
  MainSuggestionCard,
  WeatherContext,
} from "../components/suggestion";
import OccasionDropdown from "../components/suggestion/OccasionDropdown";
import { useWeather } from "../hooks/useWeather";
import { useAuth } from "../hooks/auth/useAuth";
import { GetOutfitSuggestionAPI, CreateOutfitAPI } from "../services/endpoint/outfit";
import { CreateCalendarEntryAPI } from "../services/endpoint/calendar";
import { SuggestedItem } from "../types/outfit";
import { useNotification } from "../hooks/notification/useNotification";
import { getUserId } from "../services/api/apiClient";

const SuggestionScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const {
    todayForecast,
    cityName,
    isLoading: isLoadingWeather,
    error: weatherError,
    requestLocation,
  } = useWeather({ enabled: true });

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [suggestedItems, setSuggestedItems] = useState<SuggestedItem[]>([]);
  const [suggestionReason, setSuggestionReason] = useState<string>("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUsingToday, setIsUsingToday] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("Casual");

  // Generate outfit suggestion
  const handleGenerate = async () => {
    if (!todayForecast) {
      showError("Weather data not available. Please wait for weather to load.");
      return;
    }

    if (!user?.id) {
      showError("Please login to get outfit suggestions");
      return;
    }

    setIsLoadingSuggestion(true);
    try {
      const userId = typeof user.id === "string" ? parseInt(user.id) : user.id;
      if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      // Log request payload
      const requestPayload = {
        weather: todayForecast.description,
        userId: userId,
        occasion: selectedOccasion,
      };
      console.log("🔵 [SUGGEST OUTFIT] Request Payload:", JSON.stringify(requestPayload, null, 2));

      const response = await GetOutfitSuggestionAPI(
        todayForecast.description,
        userId
      );

      // Log response
      console.log("🟢 [SUGGEST OUTFIT] Response Status:", response.statusCode);
      console.log("🟢 [SUGGEST OUTFIT] Response Message:", response.message);
      console.log("🟢 [SUGGEST OUTFIT] Response Data:", JSON.stringify(response.data, null, 2));
      
      if (response.data?.suggestedItems) {
        console.log("🟢 [SUGGEST OUTFIT] Suggested Items Count:", response.data.suggestedItems.length);
        response.data.suggestedItems.forEach((item, index) => {
          console.log(`🟢 [SUGGEST OUTFIT] Item ${index + 1}:`, {
            id: item.id,
            name: item.name,
            categoryName: item.categoryName,
            color: item.color,
            fabric: item.fabric,
            weatherSuitable: item.weatherSuitable,
            seasons: item.seasons?.map(s => s.name || s),
            styles: item.styles?.map(s => s.name || s),
            isAnalyzed: item.isAnalyzed,
            aiConfidence: item.aiConfidence,
            itemType: item.itemType,
          });
        });
        console.log("🟢 [SUGGEST OUTFIT] Reason:", response.data.reason);
      }

      if (response.statusCode === 200 && response.data) {
        setSuggestedItems(response.data.suggestedItems);
        setSuggestionReason(response.data.reason);
        setCurrentSuggestionIndex(0);
        showSuccess("Outfit suggestion generated!");
      } else {
        throw new Error(response.message || "Failed to generate suggestion");
      }
    } catch (error: any) {
      console.error("Failed to get outfit suggestion:", error);
      
      // Extract error message from API response
      let errorMessage = "Failed to generate outfit suggestion";
      
      if (error.response?.data?.message) {
        // Server returned a specific error message
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.data?.message) {
        // Nested message structure
        errorMessage = error.response.data.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check if it's a subscription limit error
      if (errorMessage.includes("Subscription limit") || errorMessage.includes("credits remaining")) {
        showError(errorMessage);
      } else {
        showError(errorMessage);
      }
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  // Handlers
  const handlePreviousSuggestion = () => {
    if (suggestedItems.length === 0) return;
    setCurrentSuggestionIndex((prev) => 
      prev > 0 ? prev - 1 : suggestedItems.length - 1
    );
  };

  const handleNextSuggestion = () => {
    if (suggestedItems.length === 0) return;
    setCurrentSuggestionIndex((prev) => 
      prev < suggestedItems.length - 1 ? prev + 1 : 0
    );
  };

  const handleSave = async () => {
    if (suggestedItems.length === 0) {
      showError("No outfit to save");
      return;
    }

    setIsSaving(true);
    try {
      const itemIds = suggestedItems.map((item) => item.id);
      const response = await CreateOutfitAPI({
        name: `AI Suggested Outfit - ${new Date().toLocaleDateString()}`,
        description: suggestionReason || "AI-generated outfit suggestion",
        itemIds: itemIds,
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccess("Outfit added to wardrobe!");
      } else {
        throw new Error(response.message || "Failed to save outfit");
      }
    } catch (error: any) {
      console.error("Error saving outfit:", error);
      showError(error.message || "Failed to save outfit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseToday = async () => {
    if (suggestedItems.length === 0) {
      showError("No outfit to use");
      return;
    }

    setIsUsingToday(true);
    try {
      // Step 1: Create the outfit
      const itemIds = suggestedItems.map((item) => item.id);
      const outfitResponse = await CreateOutfitAPI({
        name: `Today's Outfit - ${new Date().toLocaleDateString()}`,
        description: suggestionReason || "AI-generated outfit suggestion",
        itemIds: itemIds,
      });

      if (outfitResponse.statusCode !== 200 && outfitResponse.statusCode !== 201) {
        throw new Error(outfitResponse.message || "Failed to create outfit");
      }

      const outfitId = outfitResponse.data.id;

      // Step 2: Add to calendar for today
      const today = new Date();
      const todayString = today.toISOString().split('T')[0] + 'T' + 
        today.toTimeString().split(' ')[0]; // Format: yyyy-MM-ddTHH:mm:ss

      const calendarResponse = await CreateCalendarEntryAPI({
        outfitIds: [outfitId],
        isDaily: true,
        time: todayString,
      });

      if (calendarResponse.statusCode === 200 || calendarResponse.statusCode === 201) {
        showSuccess("Outfit added and scheduled for today!");
      } else {
        throw new Error(calendarResponse.message || "Failed to add to calendar");
      }
    } catch (error: any) {
      console.error("Error using outfit today:", error);
      showError(error.message || "Failed to set up outfit for today");
    } finally {
      setIsUsingToday(false);
    }
  };

  const handleShare = () => {
    Alert.alert("Share", "Share outfit with friends");
  };

  const handleWeatherRefresh = async () => {
    await requestLocation();
  };

  // Note: Web does NOT auto-generate, only generates when user clicks button

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
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
        {/* Header Section - Similar to Web */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>What to wear today?</Text>
          <Text style={styles.headerSubtitle}>
            Get personalized outfit suggestions powered by AI
          </Text>
        </View>

        {/* Weather Section - Similar to Web */}
        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>Today's weather</Text>
          
          {/* Loading State */}
          {isLoadingWeather && !todayForecast ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Loading weather...</Text>
            </View>
          ) : weatherError && !todayForecast ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{weatherError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleWeatherRefresh}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : todayForecast ? (
            <WeatherContext
              temperature={Math.round(todayForecast.temperature)}
              description={todayForecast.description}
              condition={todayForecast.description}
              onRefresh={handleWeatherRefresh}
              cityName={cityName}
            />
          ) : null}
        </View>

        {/* Occasion Dropdown and Generate Button - Always visible when weather is available */}
        {todayForecast && (
          <View style={styles.suggestSection}>
            <View style={styles.occasionRow}>
              <OccasionDropdown
                value={selectedOccasion}
                onSelect={setSelectedOccasion}
              />
            </View>
            <View style={styles.generateButtonContainer}>
              <TouchableOpacity
                style={[styles.generateButton, (isLoadingSuggestion || !todayForecast) && styles.generateButtonDisabled]}
                onPress={handleGenerate}
                disabled={isLoadingSuggestion || !todayForecast}
              >
                {isLoadingSuggestion ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.generateButtonText}>Generating Suggestions...</Text>
                  </>
                ) : (
                  <Text style={styles.generateButtonText}>
                    {suggestedItems.length > 0 ? "Generate New Suggestion" : "Suggest Today Outfit"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Suggestion Results - Similar to Web */}
        {suggestedItems.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsTitleRow}>
                <View style={styles.resultsTitleContainer}>
                  <Text style={styles.resultsTitle}>Your Suggested Outfit</Text>
                  <Text style={styles.resultsSubtitle}>
                    AI-generated outfit suggestions based on today's weather
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSuggestedItems([]);
                    setSuggestionReason("");
                    setCurrentSuggestionIndex(0);
                  }}
                >
                  <Ionicons name="close-circle-outline" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
            <MainSuggestionCard
              items={suggestedItems.map((item) => ({
                id: item.id,
                name: item.name,
                imageUrl: item.imgUrl,
                categoryName: item.categoryName,
                color: item.color,
                fabric: item.fabric,
                weatherSuitable: item.weatherSuitable,
                seasons: item.seasons,
                styles: item.styles,
                isAnalyzed: item.isAnalyzed,
                aiConfidence: item.aiConfidence,
                itemType: item.itemType,
              }))}
              currentIndex={currentSuggestionIndex}
              totalSuggestions={suggestedItems.length}
              onPrevious={handlePreviousSuggestion}
              onNext={handleNextSuggestion}
              onSave={handleSave}
              onShare={handleShare}
              onUseToday={handleUseToday}
              isSaving={isSaving}
              isUsingToday={isUsingToday}
              reason={suggestionReason}
            />
          </View>
        )}

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
  // Header Section
  headerSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  // Weather Section
  weatherSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#64748B",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Suggest Section
  suggestSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  occasionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  generateButtonContainer: {
    width: "100%",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#06B6D4",
    paddingVertical: 20,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  // Results Section
  resultsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  resultsTitleContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SuggestionScreen;
