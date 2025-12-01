import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Outfit } from "../../types/outfit";
import { CreateCalenderRequest, CalendarEntry } from "../../types/calendar";
import { CalendarUserOccasion } from "../../types/calendar";

interface AddCalendarModalProps {
  visible: boolean;
  selectedDate: Date | null;
  mode: "daily" | "normal"; // "daily" for isDaily=true, "normal" for isDaily=false
  userOccasionId?: number; // Required when mode is "normal"
  userOccasions?: CalendarUserOccasion[]; // List of occasions for the selected date
  outfits: Outfit[];
  calendarEntries?: CalendarEntry[]; // Calendar entries to check for duplicate outfits
  onLoadMore?: () => Promise<Outfit[] | undefined>; // Function to load more outfits
  hasMore?: boolean; // Whether there are more outfits to load
  loadingMore?: boolean; // Whether currently loading more outfits
  onClose: () => void;
  onSubmit: (data: CreateCalenderRequest) => Promise<void>;
}

export const AddCalendarModal: React.FC<AddCalendarModalProps> = ({
  visible,
  selectedDate,
  mode,
  userOccasionId,
  userOccasions = [],
  outfits,
  calendarEntries = [],
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  onClose,
  onSubmit,
}) => {
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<number[]>([]);
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | undefined>(
    userOccasionId
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible) {
      if (mode === "normal" && userOccasionId) {
        setSelectedOccasionId(userOccasionId);
      }
    } else {
      // Reset when modal closes
      setSelectedOutfitIds([]);
      setSearchQuery("");
      if (mode === "normal" && userOccasionId) {
        setSelectedOccasionId(userOccasionId);
      } else {
        setSelectedOccasionId(undefined);
      }
    }
  }, [visible, mode, userOccasionId]);

  // Get outfit IDs already used in the selected date
  const usedOutfitIds = useMemo(() => {
    if (!selectedDate || calendarEntries.length === 0) return new Set<number>();
    
    const dateString = selectedDate.toISOString().split("T")[0];
    const usedIds = new Set<number>();
    
    calendarEntries.forEach((entry) => {
      const occasionDate = entry.userOccasion.dateOccasion.split("T")[0];
      if (occasionDate === dateString) {
        entry.outfits.forEach((outfit) => {
          usedIds.add(outfit.outfitId);
        });
      }
    });
    
    return usedIds;
  }, [selectedDate, calendarEntries]);

  const filteredOutfits = useMemo(() => {
    if (!searchQuery.trim()) return outfits;
    const query = searchQuery.toLowerCase();
    return outfits.filter(
      (outfit) =>
        outfit.name.toLowerCase().includes(query) ||
        outfit.description?.toLowerCase().includes(query)
    );
  }, [outfits, searchQuery]);

  const toggleOutfit = (outfitId: number) => {
    // Prevent selecting outfits that are already used in the day
    if (usedOutfitIds.has(outfitId)) {
      return;
    }
    
    setSelectedOutfitIds((prev) =>
      prev.includes(outfitId)
        ? prev.filter((id) => id !== outfitId)
        : [...prev, outfitId]
    );
  };

  const handleSubmit = async () => {
    if (selectedOutfitIds.length === 0) {
      return;
    }

    if (mode === "normal" && !selectedOccasionId) {
      return;
    }

    setLoading(true);
    try {
      let request: CreateCalenderRequest;

      if (mode === "daily") {
        // Daily outfit: isDaily=true, no userOccasionId, requires time
        if (!selectedDate) return;
        const dateStr = selectedDate.toISOString().split("T")[0];
        const time = `${dateStr}T09:00:00`;
        const endTime = `${dateStr}T17:00:00`;

        request = {
          outfitIds: selectedOutfitIds,
          isDaily: true,
          time: time,
          endTime: endTime,
        };
      } else {
        // Normal: isDaily=false, requires userOccasionId, no time
        request = {
          outfitIds: selectedOutfitIds,
          isDaily: false,
          userOccasionId: selectedOccasionId,
        };
      }

      await onSubmit(request);
      onClose();
    } catch (error) {
      console.error("Failed to add calendar entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {mode === "daily" ? "Add Daily Outfit" : "Add Outfit to Occasion"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedDate ? formatDate(selectedDate) : "Select a date"}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (!onLoadMore || !hasMore || loadingMore || loading) return;
            
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
            
            if (isCloseToBottom) {
              onLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Occasion Selection (only for normal mode) */}
          {mode === "normal" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Select Occasion <Text style={styles.required}>*</Text>
              </Text>
              {userOccasions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={32} color="rgba(148,163,184,0.5)" />
                  <Text style={styles.emptyText}>No occasions available</Text>
                  <Text style={styles.emptySubtext}>
                    Create an occasion first to add outfits
                  </Text>
                </View>
              ) : (
                <View style={styles.occasionsList}>
                  {userOccasions.map((occasion) => (
                    <TouchableOpacity
                      key={occasion.id}
                      style={[
                        styles.occasionCard,
                        selectedOccasionId === occasion.id && styles.occasionCardSelected,
                      ]}
                      onPress={() => setSelectedOccasionId(occasion.id)}
                    >
                      <View style={styles.occasionCardContent}>
                        <View style={styles.occasionCardHeader}>
                          <Text style={styles.occasionName}>{occasion.name}</Text>
                          {selectedOccasionId === occasion.id && (
                            <Ionicons name="checkmark-circle" size={20} color="#38bdf8" />
                          )}
                        </View>
                        {occasion.occasionName && (
                          <Text style={styles.occasionType}>{occasion.occasionName}</Text>
                        )}
                        {occasion.description && (
                          <Text style={styles.occasionDescription} numberOfLines={2}>
                            {occasion.description}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.section}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search outfits..."
                placeholderTextColor="rgba(148,163,184,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Outfits Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Select Outfits ({selectedOutfitIds.length} selected)
              </Text>
              {filteredOutfits.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    const availableOutfits = filteredOutfits.filter(
                      (o) => !usedOutfitIds.has(o.id)
                    );
                    if (selectedOutfitIds.length === availableOutfits.length) {
                      setSelectedOutfitIds([]);
                    } else {
                      setSelectedOutfitIds(availableOutfits.map((o) => o.id));
                    }
                  }}
                >
                  <Text style={styles.selectAllText}>
                    {selectedOutfitIds.length === filteredOutfits.filter((o) => !usedOutfitIds.has(o.id)).length
                      ? "Deselect All"
                      : "Select All"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {filteredOutfits.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="shirt-outline" size={48} color="rgba(148,163,184,0.5)" />
                <Text style={styles.emptyText}>
                  {searchQuery ? "No outfits found" : "No outfits available"}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.outfitsGrid}>
                  {filteredOutfits.map((outfit) => {
                    const isSelected = selectedOutfitIds.includes(outfit.id);
                    const isUsed = usedOutfitIds.has(outfit.id);
                    return (
                      <TouchableOpacity
                        key={outfit.id}
                        style={[
                          styles.outfitCard,
                          isSelected && styles.outfitCardSelected,
                          isUsed && styles.outfitCardUsed,
                        ]}
                        onPress={() => toggleOutfit(outfit.id)}
                        disabled={isUsed}
                        activeOpacity={isUsed ? 1 : 0.7}
                      >
                        <View style={styles.outfitImages}>
                          {outfit.items.slice(0, 4).map((item, idx) => (
                            <View key={idx} style={styles.outfitImageContainer}>
                              {item.imgUrl ? (
                                <Image
                                  source={{ uri: item.imgUrl }}
                                  style={[styles.outfitImage, isUsed && styles.outfitImageUsed]}
                                />
                              ) : (
                                <View style={styles.outfitImagePlaceholder}>
                                  <Ionicons name="shirt-outline" size={20} color="#94a3b8" />
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                        <Text style={[styles.outfitName, isUsed && styles.outfitNameUsed]} numberOfLines={1}>
                          {outfit.name}
                        </Text>
                        <Text style={[styles.outfitItemsCount, isUsed && styles.outfitItemsCountUsed]}>
                          {outfit.items.length} items
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Ionicons name="checkmark" size={16} color="#ffffff" />
                          </View>
                        )}
                        {isUsed && (
                          <View style={styles.usedBadge}>
                            <Ionicons name="checkmark-circle" size={18} color="#94a3b8" />
                            <Text style={styles.usedBadgeText}>Already used</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {/* Load More Indicator */}
                {!searchQuery && hasMore && onLoadMore && (
                  <View style={styles.loadMoreContainer}>
                    {loadingMore ? (
                      <>
                        <ActivityIndicator size="small" color="#38bdf8" />
                        <Text style={styles.loadMoreText}>Loading more outfits...</Text>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.loadMoreButton}
                        onPress={onLoadMore}
                      >
                        <Text style={styles.loadMoreButtonText}>Load More</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (loading ||
                selectedOutfitIds.length === 0 ||
                (mode === "normal" && !selectedOccasionId)) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              loading ||
              selectedOutfitIds.length === 0 ||
              (mode === "normal" && !selectedOccasionId)
            }
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Add to Calendar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030617",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.2)",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(226,232,240,0.7)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  required: {
    color: "#ef4444",
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38bdf8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
  },
  occasionsList: {
    gap: 12,
    marginTop: 12,
  },
  occasionCard: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  occasionCardSelected: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56,189,248,0.1)",
  },
  occasionCardContent: {
    gap: 8,
  },
  occasionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  occasionName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  occasionType: {
    fontSize: 13,
    color: "#a78bfa",
    fontWeight: "600",
  },
  occasionDescription: {
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
  },
  outfitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  outfitCard: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    position: "relative",
  },
  outfitCardSelected: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56,189,248,0.1)",
  },
  outfitCardUsed: {
    opacity: 0.5,
    borderColor: "rgba(148,163,184,0.3)",
    backgroundColor: "rgba(15,23,42,0.4)",
  },
  outfitImageUsed: {
    opacity: 0.4,
  },
  outfitNameUsed: {
    color: "rgba(148,163,184,0.6)",
  },
  outfitItemsCountUsed: {
    color: "rgba(148,163,184,0.5)",
  },
  usedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
  },
  usedBadgeText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
  },
  outfitImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  outfitImageContainer: {
    width: "48%",
    aspectRatio: 1,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  outfitImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  outfitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  outfitItemsCount: {
    fontSize: 12,
    color: "#94a3b8",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#38bdf8",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(226,232,240,0.5)",
    marginTop: 12,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 12,
    color: "rgba(226,232,240,0.4)",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.2)",
    backgroundColor: "#030617",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#38bdf8",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadMoreContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(56,189,248,0.15)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.3)",
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38bdf8",
  },
});

