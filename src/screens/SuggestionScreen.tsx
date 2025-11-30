import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/common";
import { MainSuggestionCard, WeatherContext } from "../components/suggestion";
import OccasionDropdown from "../components/suggestion/OccasionDropdown";
import OutfitCountDropdown from "../components/suggestion/OutfitCountDropdown";
import { useWeather } from "../hooks/useWeather";
import { useAuth } from "../hooks/auth/useAuth";
import {
  GetOutfitSuggestionV2API,
  CreateOutfitAPI,
  MassCreateOutfitsAPI,
} from "../services/endpoint/outfit";
import { CreateCalendarEntryAPI } from "../services/endpoint/calendar";
import { SuggestedItem } from "../types/outfit";
import { useNotification } from "../hooks/notification/useNotification";
import { getUserId } from "../services/api/apiClient";
import { GetOccasionsAPI } from "../services/endpoint/occasion";
import { Occasion } from "../types/occasion";

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

  // V2 API - Multiple outfits support
  const [suggestionResults, setSuggestionResults] = useState<
    Array<{
      suggestedItems: SuggestedItem[];
      reason: string;
    }>
  >([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [selectedOutfitIndexes, setSelectedOutfitIndexes] = useState<number[]>(
    []
  );
  const [totalOutfit, setTotalOutfit] = useState<number>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("Casual");
  const [selectedOccasionId, setSelectedOccasionId] = useState<
    number | undefined
  >(undefined);
  const [occasions, setOccasions] = useState<Occasion[]>([]);

  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUsingToday, setIsUsingToday] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);

  // Fetch occasions to get IDs
  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const response = await GetOccasionsAPI({
          pageIndex: 1,
          pageSize: 100,
          takeAll: true,
        });
        if (response.statusCode === 200 && response.data?.data) {
          setOccasions(response.data.data);
          // Set default occasion ID
          const defaultOccasion = response.data.data.find(
            (o: Occasion) => o.name === "Casual"
          );
          if (defaultOccasion) {
            setSelectedOccasionId(defaultOccasion.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch occasions:", error);
      }
    };
    fetchOccasions();
  }, []);

  // Update occasion ID when name changes
  useEffect(() => {
    const occasion = occasions.find((o) => o.name === selectedOccasion);
    if (occasion) {
      setSelectedOccasionId(occasion.id);
    } else {
      setSelectedOccasionId(undefined);
    }
  }, [selectedOccasion, occasions]);

  // Generate outfit suggestion using V2 API
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

      // Format weather string like web: "description, Temperature: X°C, Feels like: Y°C"
      const weatherString = `${
        todayForecast.description
      }, Temperature: ${Math.round(
        todayForecast.temperature
      )}°C, Feels like: ${Math.round(todayForecast.feelsLike)}°C`;

      // Log request payload
      const requestPayload = {
        userId: userId,
        totalOutfit: totalOutfit,
        occasionId: selectedOccasionId,
        weather: weatherString,
      };
      console.log(
        "🔵 [SUGGEST OUTFIT V2] Request Payload:",
        JSON.stringify(requestPayload, null, 2)
      );

      const response = await GetOutfitSuggestionV2API(
        userId,
        totalOutfit,
        selectedOccasionId,
        weatherString
      );

      // Log response
      console.log(
        "🟢 [SUGGEST OUTFIT V2] Response Status:",
        response.statusCode
      );
      console.log("🟢 [SUGGEST OUTFIT V2] Response Message:", response.message);
      console.log(
        "🟢 [SUGGEST OUTFIT V2] Outfits Count:",
        response.data?.length || 0
      );

      if (response.data) {
        response.data.forEach((outfit, index) => {
          console.log(`🟢 [SUGGEST OUTFIT V2] Outfit ${index + 1}:`, {
            itemsCount: outfit.suggestedItems?.length || 0,
            hasReason: !!outfit.reason,
          });
        });
      }

      if (response.statusCode === 200 && response.data) {
        setSuggestionResults(response.data);
        setCurrentSuggestionIndex(0); // Reset to first outfit
        setSelectedOutfitIndexes([]); // Reset selections
        showSuccess("Outfit suggestions generated!");
      } else {
        throw new Error(response.message || "Failed to generate suggestions");
      }
    } catch (error: any) {
      console.error("Failed to get outfit suggestions:", error);

      // Extract error message from API response
      let errorMessage = "Failed to generate outfit suggestions";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.data?.message) {
        errorMessage = error.response.data.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  // Toggle outfit selection
  const handleToggleOutfitSelection = (index: number) => {
    setSelectedOutfitIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Select/Deselect all outfits
  const handleSelectAll = () => {
    if (selectedOutfitIndexes.length === suggestionResults.length) {
      setSelectedOutfitIndexes([]);
    } else {
      setSelectedOutfitIndexes(suggestionResults.map((_, index) => index));
    }
  };

  // Add selected outfits using mass create API
  const handleAddSelectedOutfits = async () => {
    if (selectedOutfitIndexes.length === 0) {
      showError("Please select at least one outfit");
      return;
    }

    setIsAddingMultiple(true);
    try {
      const outfitsToCreate = selectedOutfitIndexes.map((index) => {
        const suggestion = suggestionResults[index];
        return {
          name: `AI Suggested Outfit ${
            index + 1
          } - ${new Date().toLocaleDateString()}`,
          description: suggestion.reason,
          itemIds: suggestion.suggestedItems.map((item) => item.id),
        };
      });

      const response = await MassCreateOutfitsAPI({ outfits: outfitsToCreate });

      if (response.data.totalFailed === 0) {
        showSuccess(
          `Successfully added ${response.data.totalCreated} outfit(s)!`
        );
        setSelectedOutfitIndexes([]);
      } else if (response.data.totalCreated > 0) {
        // Partial success
        showError(
          `Added ${response.data.totalCreated} outfit(s), ${response.data.totalFailed} failed`
        );
        setSelectedOutfitIndexes([]);
      } else {
        // All failed
        showError("Failed to add outfits");
      }
    } catch (error: any) {
      console.error("Error adding multiple outfits:", error);
      showError(error.message || "Failed to add outfits");
    } finally {
      setIsAddingMultiple(false);
    }
  };

  // Save single outfit
  const handleSave = async (outfitIndex: number) => {
    const outfit = suggestionResults[outfitIndex];
    if (!outfit || outfit.suggestedItems.length === 0) {
      showError("No outfit to save");
      return;
    }

    setIsSaving(true);
    try {
      const itemIds = outfit.suggestedItems.map((item) => item.id);
      const response = await CreateOutfitAPI({
        name: `AI Suggested Outfit - ${new Date().toLocaleDateString()}`,
        description: outfit.reason || "AI-generated outfit suggestion",
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

  // Use outfit today
  const handleUseToday = async (outfitIndex: number) => {
    const outfit = suggestionResults[outfitIndex];
    if (!outfit || outfit.suggestedItems.length === 0) {
      showError("No outfit to use");
      return;
    }

    setIsUsingToday(true);
    try {
      // Step 1: Create the outfit
      const itemIds = outfit.suggestedItems.map((item) => item.id);
      const outfitResponse = await CreateOutfitAPI({
        name: `Today's Outfit - ${new Date().toLocaleDateString()}`,
        description: outfit.reason || "AI-generated outfit suggestion",
        itemIds: itemIds,
      });

      if (
        outfitResponse.statusCode !== 200 &&
        outfitResponse.statusCode !== 201
      ) {
        throw new Error(outfitResponse.message || "Failed to create outfit");
      }

      const outfitId = outfitResponse.data.id;

      // Step 2: Add to calendar for today
      const today = new Date();
      const todayString =
        today.toISOString().split("T")[0] +
        "T" +
        today.toTimeString().split(" ")[0]; // Format: yyyy-MM-ddTHH:mm:ss

      const calendarResponse = await CreateCalendarEntryAPI({
        outfitIds: [outfitId],
        isDaily: true,
        time: todayString,
      });

      if (
        calendarResponse.statusCode === 200 ||
        calendarResponse.statusCode === 201
      ) {
        showSuccess("Outfit added and scheduled for today!");
      } else {
        throw new Error(
          calendarResponse.message || "Failed to add to calendar"
        );
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
        title="Suggest"
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>What to wear today?</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered outfit suggestions
          </Text>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherSection}>
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
              forecast={todayForecast}
            />
          ) : null}
        </View>

        {/* Occasion Dropdown, Outfit Count, and Generate Button - Always visible when weather is available */}
        {todayForecast && (
          <View style={styles.suggestSection}>
            <View style={styles.controlsRow}>
              <View style={styles.occasionContainer}>
                <OccasionDropdown
                  value={selectedOccasion}
                  onSelect={setSelectedOccasion}
                />
              </View>
              <View style={styles.countContainer}>
                <OutfitCountDropdown
                  value={totalOutfit}
                  onSelect={setTotalOutfit}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (isLoadingSuggestion || !todayForecast) &&
                    styles.generateButtonDisabled,
                ]}
                onPress={handleGenerate}
                disabled={isLoadingSuggestion || !todayForecast}
              >
                {isLoadingSuggestion ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.generateButtonText} numberOfLines={1}>
                      Generating...
                    </Text>
                  </>
                ) : (
                  <Text style={styles.generateButtonText} numberOfLines={1}>
                    Generate
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Suggestion Results - Multiple Outfits */}
        {suggestionResults.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsTitleRow}>
                <View style={styles.resultsTitleContainer}>
                  <View style={styles.resultsTitleWithIndicator}>
                    <Text style={styles.resultsTitle}>Your Outfits</Text>
                    {suggestionResults.length > 1 && (
                      <Text style={styles.outfitIndicator}>
                        {currentSuggestionIndex + 1}/{suggestionResults.length}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.resultsSubtitle}>
                    {selectedOccasion} •{" "}
                    {todayForecast
                      ? `${Math.round(todayForecast.temperature)}°C`
                      : ""}
                  </Text>
                </View>
              </View>

              {/* Mass Add Controls - Only show if multiple outfits */}
              {suggestionResults.length > 1 && (
                <View style={styles.massAddControls}>
                  <TouchableOpacity
                    style={styles.deselectAllButton}
                    onPress={handleSelectAll}
                  >
                    <Text style={styles.deselectAllText}>
                      {selectedOutfitIndexes.length === suggestionResults.length
                        ? "Deselect All"
                        : "Select All"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.addSelectedButton,
                      selectedOutfitIndexes.length === 0 &&
                        styles.addSelectedButtonDisabled,
                    ]}
                    onPress={handleAddSelectedOutfits}
                    disabled={
                      selectedOutfitIndexes.length === 0 || isAddingMultiple
                    }
                  >
                    {isAddingMultiple ? (
                      <>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.addSelectedButtonText}>
                          Adding...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                        <Text style={styles.addSelectedButtonText}>
                          Add Selected ({selectedOutfitIndexes.length})
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Display Current Outfit with Navigation */}
            {suggestionResults.length > 0 && (
              <View style={styles.outfitContainer}>
                <MainSuggestionCard
                  items={suggestionResults[
                    currentSuggestionIndex
                  ].suggestedItems.map((item) => {
                    return {
                      id: item.id,
                      name: item.name,
                      imageUrl: item.imgUrl || undefined,
                      categoryName: item.categoryName,
                      color: item.color,
                      fabric: item.fabric,
                      weatherSuitable: item.weatherSuitable,
                      seasons: item.seasons,
                      styles: item.styles,
                      isAnalyzed: item.isAnalyzed,
                      aiConfidence: item.aiConfidence,
                      itemType: item.itemType,
                    };
                  })}
                  currentIndex={currentSuggestionIndex}
                  totalSuggestions={suggestionResults.length}
                  onPrevious={() => {
                    setCurrentSuggestionIndex((prev) =>
                      prev > 0 ? prev - 1 : suggestionResults.length - 1
                    );
                  }}
                  onNext={() => {
                    setCurrentSuggestionIndex((prev) =>
                      prev < suggestionResults.length - 1 ? prev + 1 : 0
                    );
                  }}
                  onSave={() => handleSave(currentSuggestionIndex)}
                  onShare={handleShare}
                  onUseToday={() => handleUseToday(currentSuggestionIndex)}
                  isSaving={isSaving}
                  isUsingToday={isUsingToday}
                  reason={suggestionResults[currentSuggestionIndex].reason}
                />
              </View>
            )}
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
    backgroundColor: "#030617",
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 60, // pb-32 equivalent (32 * 4 = 128px)
  },
  // Header Section
  headerSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  // Weather Section
  weatherSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  weatherHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  chooseLocationLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  locationTabs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  locationTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    gap: 6,
  },
  locationTabActive: {
    backgroundColor: "#3B82F6",
  },
  locationTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  locationTabTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
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
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  occasionContainer: {
    flex: 0.4,
    minWidth: 100,
  },
  countContainer: {
    flex: 0.1,
    minWidth: 100,
  },
  generateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 48,
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    includeFontPadding: false,
    textAlignVertical: "center",
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
  resultsTitleWithIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  outfitIndicator: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
  },
  resultsSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Mass Add Controls
  massAddControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  deselectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deselectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  addSelectedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addSelectedButtonDisabled: {
    opacity: 0.5,
  },
  addSelectedButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Outfit Container
  outfitContainer: {
    marginTop: 8,
  },
});

export default SuggestionScreen;
