import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedBackground, Header } from "../components/common";
import {
  MainSuggestionCard,
  CompactDateWeatherCard,
  CompactUserEvents,
  GenerateControls,
  CreateOccasionModal,
} from "../components/suggestion";
import { useWeather } from "../hooks/useWeather";
import { useAuth } from "../hooks/auth/useAuth";
import {
  GetOutfitSuggestionV2API,
  CreateOutfitAPI,
  MassCreateOutfitsAPI,
} from "../services/endpoint/outfit";
import { CalenderAPI } from "../services/endpoint/calendar";
import { SuggestedItem } from "../types/outfit";
import { useNotification } from "../hooks/notification/useNotification";
import { GetOccasionsAPI } from "../services/endpoint/occasion";
import { Occasion } from "../types/occasion";
import { format } from "date-fns";

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
  const [totalOutfit] = useState<number>(4);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);

  // Phase 2: Date Picker & User Occasions
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedUserOccasionId, setSelectedUserOccasionId] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<Array<{
    id: string;
    occasionId: string;
    occasionName: string;
    note?: string;
    date: string;
    time?: string;
  }>>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Create Occasion Modal
  const [showCreateOccasionModal, setShowCreateOccasionModal] = useState(false);

  // Advanced Settings - Gap Days (fixed at 2, no UI)
  const [gapDay] = useState<number>(2);

  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUsingToday, setIsUsingToday] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState<{
    context: "save" | "use";
    message: string;
  } | null>(null);

  // Reset user occasion selection when date changes
  useEffect(() => {
    setSelectedUserOccasionId(null);
  }, [selectedDate]);

  

  

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
          // Set default occasion
          const defaultOccasion = response.data.data.find(
            (o: Occasion) => o.name === "Casual"
          );
          if (defaultOccasion) {
            setSelectedOccasion(defaultOccasion);
          }
        }
      } catch (error) {
        console.error("Failed to fetch occasions:", error);
      }
    };
    fetchOccasions();
  }, []);

  // Fetch user events function - reusable
  const fetchUserEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await CalenderAPI.getUserOccasions({
        PageIndex: 1,
        PageSize: 100,
        StartDate: dateStr,
        EndDate: dateStr,
      });
      if (response.statusCode === 200 && response.data?.data) {
        const events = response.data.data.map((event) => ({
          id: event.id.toString(),
          occasionId: event.occasionId.toString(),
          occasionName: event.occasionName || event.name,
          note: event.description,
          date: event.dateOccasion,
          time: event.startTime,
        }));
        setUserEvents(events);
      } else {
        setUserEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch user events:", error);
      setUserEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [selectedDate]);

  // Fetch user events when date changes
  useEffect(() => {
    setSelectedUserOccasionId(null); // Reset selection when date changes
    fetchUserEvents();
  }, [fetchUserEvents]);

  // Handle create occasion success
  const handleCreateOccasionSuccess = () => {
    showSuccess("Occasion created successfully!");
    fetchUserEvents(); // Refresh events list
  };

  // Handle user event selection - also update occasion
  const handleUserEventSelect = (eventId: string, occasionId: string) => {
    setSelectedUserOccasionId(eventId);
    // Find and select the matching occasion
    const matchingOccasion = occasions.find(
      (o) => o.id.toString() === occasionId
    );
    if (matchingOccasion) {
      setSelectedOccasion(matchingOccasion);
    }
  };

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

      // Format target date as yyyy-MM-dd (using selected date instead of today)
      const targetDateStr = format(selectedDate, "yyyy-MM-dd");

      const response = await GetOutfitSuggestionV2API(
        userId,
        totalOutfit,
        selectedOccasion?.id,
        weatherString,
        gapDay, // Pass gapDay to avoid recently worn items
        targetDateStr, // Pass selected date as target
        selectedUserOccasionId ? parseInt(selectedUserOccasionId, 10) : undefined // Pass user occasion ID if selected
      );

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

  // Helper: structured API error logging for debugging
  const logApiError = (context: string, error: any) => {
    console.error(`❌ [${context}] API Error:`, {
      message: error?.message,
      isAxiosError: !!error?.isAxiosError,
      status: error?.response?.status,
      url: error?.response?.config?.url,
      method: error?.response?.config?.method,
      responseData: error?.response?.data,
    });
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
      logApiError("SuggestionScreen.handleSave", error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save outfit. Please try again.";

      // If outfit already exists, show friendly modal instead of only toast
      if (
        error?.response?.status === 400 &&
        typeof error?.response?.data?.message === "string" &&
        error.response.data.message
          .toLowerCase()
          .includes("same combination of items already exists")
      ) {
        setDuplicateModal({
          context: "save",
          message: error.response.data.message,
        });
      } else {
        showError(apiMessage);
      }
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

      const calendarResponse = await CalenderAPI.createCalendarEntry({
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
      logApiError("SuggestionScreen.handleUseToday", error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to set up outfit for today. Please try again.";

      if (
        error?.response?.status === 400 &&
        typeof error?.response?.data?.message === "string" &&
        error.response.data.message
          .toLowerCase()
          .includes("same combination of items already exists")
      ) {
        setDuplicateModal({
          context: "use",
          message: error.response.data.message,
        });
      } else {
        showError(apiMessage);
      }
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
      <AnimatedBackground>
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Compact Date + Weather Card */}
          <View style={styles.topSection}>
            <CompactDateWeatherCard
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              temperature={todayForecast ? Math.round(todayForecast.temperature) : undefined}
              weatherDescription={todayForecast?.description}
              cityName={cityName}
              isLoadingWeather={isLoadingWeather}
            />
          </View>

          {/* User Events - Always show with Create button */}
          <View style={styles.eventsSection}>
            <CompactUserEvents
              events={userEvents}
              selectedEventId={selectedUserOccasionId}
              onSelectEvent={handleUserEventSelect}
              isLoading={isLoadingEvents}
              onCreatePress={() => setShowCreateOccasionModal(true)}
            />
          </View>

          {/* Generate Controls */}
          <View style={styles.controlsSection}>
            <GenerateControls
              selectedOccasion={selectedOccasion ? { id: selectedOccasion.id.toString(), name: selectedOccasion.name } : null}
              occasions={occasions.map((o) => ({ id: o.id.toString(), name: o.name }))}
              onSelectOccasion={(occ) => {
                const found = occasions.find((o) => o.id.toString() === occ.id);
                if (found) setSelectedOccasion(found);
              }}
              onGenerate={handleGenerate}
              isGenerating={isLoadingSuggestion}
            />
          </View>

          {/* Weather Error */}
          {weatherError && !todayForecast && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{weatherError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleWeatherRefresh}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
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
                          {currentSuggestionIndex + 1}/
                          {suggestionResults.length}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.resultsSubtitle}>
                      {selectedOccasion?.name || "Casual"} •{" "}
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
                        {selectedOutfitIndexes.length ===
                        suggestionResults.length
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
                          <Ionicons
                            name="add-circle"
                            size={18}
                            color="#FFFFFF"
                          />
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
      </AnimatedBackground>

      {/* Duplicate outfit modal */}
      {duplicateModal && (
        <Modal
          transparent
          visible={!!duplicateModal}
          animationType="fade"
          onRequestClose={() => setDuplicateModal(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconContainer}>
                <View style={styles.modalIconCircle}>
                  <Ionicons name="alert-circle" size={24} color="#B91C1C" />
                </View>
              </View>
              {/* EN: This outfit already exists / VN: Outfit này đã tồn tại */}
              <Text style={styles.modalTitle}>This outfit already exists</Text>
              <Text style={styles.modalMessage}>
                {duplicateModal.context === "save"
                  ? "We’ve already created an outfit with this exact combination of items in your outfits."
                  : "We’ve already created an outfit with this exact combination of items in your calendar."}
              </Text>
              <Text style={styles.modalHint}>
                {duplicateModal.context === "save"
                  ? "Open your outfits to reuse it, or stay here and try a different combination."
                  : "Open your calendar to use it today, or stay here and try a different combination."}
              </Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setDuplicateModal(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSecondaryText}>Stay here</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={() => {
                    if (duplicateModal.context === "save") {
                      navigation.navigate("Outfit");
                    } else {
                      navigation.navigate("Outfit");
                    }
                    setDuplicateModal(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalPrimaryText}>
                    {duplicateModal.context === "save"
                      ? "Go to outfits"
                      : "Go to calendar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Create Occasion Modal */}
      <CreateOccasionModal
        visible={showCreateOccasionModal}
        onClose={() => setShowCreateOccasionModal(false)}
        onSuccess={handleCreateOccasionSuccess}
        initialDate={selectedDate}
        weatherSnapshot={
          todayForecast
            ? `${todayForecast.description}, ${Math.round(todayForecast.temperature)}°C`
            : ""
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#030617",
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 60, // pb-32 equivalent (32 * 4 = 128px)
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.35)",
  },
  modalIconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalSecondaryButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // New compact layout styles
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 80,
  },
  topSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  eventsSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  controlsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  // Legacy styles kept for compatibility
  // Date Section
  dateSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  // User Occasions Section
  occasionsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
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
