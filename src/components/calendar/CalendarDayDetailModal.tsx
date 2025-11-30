import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarEntry, Calender, CalendarUserOccasion } from "../../types/calendar";
import { Outfit } from "../../types/outfit";
import { useCalendar } from "../../hooks/calendar/useCalendar";
import { AddOccasionModal } from "./AddOccasionModal";
import { EditOccasionModal } from "./EditOccasionModal";
import { AddCalendarModal } from "./AddCalendarModal";
import { CreateCalenderRequest } from "../../types/calendar";

interface CalendarDayDetailModalProps {
  visible: boolean;
  selectedDate: Date | null;
  calendarEntries: CalendarEntry[];
  outfits: Outfit[];
  onLoadMoreOutfits?: () => Promise<Outfit[] | undefined>;
  hasMoreOutfits?: boolean;
  loadingMoreOutfits?: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const formatTime = (time?: string | null): string => {
  if (!time) return "";
  const date = new Date(time);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const CalendarDayDetailModal: React.FC<CalendarDayDetailModalProps> = ({
  visible,
  selectedDate,
  calendarEntries: calendarEntriesProp,
  outfits,
  onLoadMoreOutfits,
  hasMoreOutfits = false,
  loadingMoreOutfits = false,
  onClose,
  onRefresh,
}) => {
  const [expandedOccasionIds, setExpandedOccasionIds] = useState<number[]>([]);
  const [isAddOccasionModalVisible, setIsAddOccasionModalVisible] = useState(false);
  const [isEditOccasionModalVisible, setIsEditOccasionModalVisible] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<CalendarUserOccasion | null>(null);
  const [isAddCalendarModalVisible, setIsAddCalendarModalVisible] = useState(false);
  const [calendarModalMode, setCalendarModalMode] = useState<"daily" | "normal">("daily");
  const [selectedOccasionIdForCalendar, setSelectedOccasionIdForCalendar] = useState<number | undefined>();
  const { deleteCalendarEntry, deleteUserOccasion, createCalendarEntry, createUserOccasion, updateUserOccasion } = useCalendar();

  const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : "";

  // Helper to extract date string from dateOccasion (handles timezone issues)
  const extractDateString = (dateOccasion: string): string => {
    if (!dateOccasion) return "";
    return dateOccasion.split("T")[0];
  };

  // Filter entries and occasions for selected date
  const dayEntries = useMemo(() => {
    if (!selectedDate) return [];
    return calendarEntriesProp.filter((entry) => {
      // Use dateOccasion directly, extract date part to avoid timezone issues
      const occasionDate = extractDateString(entry.userOccasion.dateOccasion);
      return occasionDate === dateString;
    });
  }, [calendarEntriesProp, dateString, selectedDate]);


  const totalOccasions = dayEntries.length;
  const totalOutfits = dayEntries.reduce(
    (sum, entry) => sum + entry.outfits.length,
    0
  );

  // Get user occasions for the selected date (for normal mode)
  const userOccasionsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return dayEntries
      .filter((entry) => !entry.isDaily)
      .map((entry) => entry.userOccasion);
  }, [dayEntries, selectedDate]);

  const handleAddOccasionSuccess = async (userOccasionId: number) => {
    // Modal is already closed by AddOccasionModal
    // Refresh data to show the new occasion
    await onRefresh();
    // Optionally open AddCalendarModal in normal mode with the new occasion
    setSelectedOccasionIdForCalendar(userOccasionId);
    setCalendarModalMode("normal");
    setIsAddCalendarModalVisible(true);
  };

  const handleEditOccasionSuccess = async () => {
    // Modal is already closed by EditOccasionModal
    // Refresh data to show the updated occasion
    await onRefresh();
    setEditingOccasion(null);
  };

  const handleAddCalendarSubmit = async (data: CreateCalenderRequest) => {
    await createCalendarEntry(data);
    setIsAddCalendarModalVisible(false);
    await onRefresh();
  };

  const handleAddDailyOutfit = () => {
    setCalendarModalMode("daily");
    setSelectedOccasionIdForCalendar(undefined);
    setIsAddCalendarModalVisible(true);
  };

  const handleAddOutfitToOccasion = (occasionId: number) => {
    setCalendarModalMode("normal");
    setSelectedOccasionIdForCalendar(occasionId);
    setIsAddCalendarModalVisible(true);
  };

  const toggleOccasion = (occasionId: number) => {
    setExpandedOccasionIds((prev) =>
      prev.includes(occasionId)
        ? prev.filter((id) => id !== occasionId)
        : [...prev, occasionId]
    );
  };

  const handleDeleteEntry = (entryId: number) => {
    Alert.alert(
      "Remove Outfit",
      "This will unlink the outfit from this occasion. The outfit itself will not be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await deleteCalendarEntry(entryId);
            if (success) {
              // deleteCalendarEntry already calls fetchCalendarEntries internally
              // Just refresh parent component to update the prop
              await onRefresh();
            }
          },
        },
      ]
    );
  };

  if (!selectedDate) return null;

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
            <Text style={styles.headerTitle}>{formatDate(selectedDate)}</Text>
            <Text style={styles.headerSubtitle}>
              Manage your occasions and outfits for this day
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar" size={16} color="#a78bfa" />
            <Text style={styles.summaryText}>{totalOccasions} Occasions</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="shirt" size={16} color="#38bdf8" />
            <Text style={styles.summaryText}>{totalOutfits} Outfits Planned</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddDailyOutfit}
            >
              <Ionicons name="add-circle-outline" size={20} color="#38bdf8" />
              <Text style={styles.actionButtonText}>Add Daily Outfit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => setIsAddOccasionModalVisible(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#ffffff" />
              <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                Add Occasion
              </Text>
            </TouchableOpacity>
          </View>

          {dayEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No occasions yet</Text>
              <Text style={styles.emptySubtext}>
                Create an occasion or add a daily outfit
              </Text>
            </View>
          ) : (
            <View style={styles.occasionsList}>
              {dayEntries.map((entry) => {
                const occasion = entry.userOccasion;
                const isExpanded = expandedOccasionIds.includes(occasion.id);
                const plannedOutfits = entry.outfits;

                return (
                  <View key={occasion.id} style={styles.occasionCard}>
                    {/* Occasion Header */}
                    <TouchableOpacity
                      style={styles.occasionHeader}
                      onPress={() => toggleOccasion(occasion.id)}
                    >
                      <View style={styles.occasionHeaderLeft}>
                        <TouchableOpacity
                          style={styles.expandButton}
                          onPress={() => toggleOccasion(occasion.id)}
                        >
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#94a3b8"
                          />
                        </TouchableOpacity>
                        <View style={styles.occasionInfo}>
                          <View style={styles.occasionBadges}>
                            <View style={styles.occasionTypeBadge}>
                              <Ionicons
                                name={entry.isDaily ? "home" : "calendar"}
                                size={14}
                                color={entry.isDaily ? "#38bdf8" : "#a78bfa"}
                              />
                              <Text style={styles.occasionTypeText}>
                                {entry.isDaily ? "Daily" : occasion.occasionName || "Occasion"}
                              </Text>
                            </View>
                            {plannedOutfits.length > 0 && (
                              <View style={styles.outfitCountBadge}>
                                <Ionicons name="shirt" size={14} color="#38bdf8" />
                                <Text style={styles.outfitCountText}>
                                  {plannedOutfits.length} outfit
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.occasionName}>{occasion.name}</Text>
                          {occasion.startTime && (
                            <View style={styles.timeRow}>
                              <Ionicons name="time-outline" size={14} color="#94a3b8" />
                              <Text style={styles.timeText}>
                                {formatTime(occasion.startTime)}
                                {occasion.endTime && ` - ${formatTime(occasion.endTime)}`}
                              </Text>
                            </View>
                          )}
                          {occasion.description && (
                            <Text style={styles.occasionDescription}>
                              {occasion.description}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.occasionActions}>
                        {!entry.isDaily && (
                          <TouchableOpacity
                            style={styles.occasionActionButton}
                            onPress={() => {
                              setEditingOccasion(occasion);
                              setIsEditOccasionModalVisible(true);
                            }}
                          >
                            <Ionicons name="pencil" size={18} color="#94a3b8" />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.occasionActionButton}
                          onPress={() => {
                            Alert.alert(
                              "Delete Occasion",
                              "Are you sure you want to delete this occasion? This will also remove all outfits linked to this occasion.",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: async () => {
                                    const success = await deleteUserOccasion(occasion.id);
                                    if (success) {
                                      // deleteUserOccasion already calls fetchCalendarEntries internally
                                      // Just refresh parent component to update the prop
                                      await onRefresh();
                                    }
                                  },
                                },
                              ]
                            );
                          }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        {/* Planned Outfits */}
                        {plannedOutfits.length > 0 ? (
                          <View style={styles.plannedOutfitsSection}>
                            <View style={styles.sectionHeader}>
                              <Ionicons name="shirt" size={16} color="#38bdf8" />
                              <Text style={styles.sectionTitle}>Planned Outfits</Text>
                            </View>
                            <View style={styles.outfitsGrid}>
                              {plannedOutfits.map((outfitEntry) => {
                                const outfit = outfits.find((o) => o.id === outfitEntry.outfitId);
                                if (!outfit) return null;

                                return (
                                  <View key={outfitEntry.calendarId} style={styles.outfitCard}>
                                    <View style={styles.outfitImages}>
                                      {outfit.items.slice(0, 4).map((item, idx) => (
                                        <View key={idx} style={styles.outfitImageContainer}>
                                          {item.imgUrl ? (
                                            <Image
                                              source={{ uri: item.imgUrl }}
                                              style={styles.outfitImage}
                                            />
                                          ) : (
                                            <View style={styles.outfitImagePlaceholder}>
                                              <Ionicons name="shirt-outline" size={20} color="#94a3b8" />
                                            </View>
                                          )}
                                        </View>
                                      ))}
                                    </View>
                                    <Text style={styles.outfitName} numberOfLines={1}>
                                      {outfit.name}
                                    </Text>
                                    <Text style={styles.outfitItemsCount}>
                                      {outfit.items.length} items
                                    </Text>
                                    <TouchableOpacity
                                      style={styles.removeButton}
                                      onPress={() => handleDeleteEntry(outfitEntry.calendarId)}
                                    >
                                      <Text style={styles.removeButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        ) : (
                          <View style={styles.emptyOutfitsSection}>
                            <Ionicons name="shirt-outline" size={32} color="rgba(148,163,184,0.5)" />
                            <Text style={styles.emptyOutfitsText}>No outfits planned</Text>
                            <Text style={styles.emptyOutfitsSubtext}>
                              Add outfits to this {entry.isDaily ? "day" : "occasion"}
                            </Text>
                          </View>
                        )}

                        {/* Add More Outfits */}
                        <View style={styles.addMoreSection}>
                          <Text style={styles.addMoreText}>
                            {entry.isDaily 
                              ? "Add more outfits to this day"
                              : "Add more outfits to this occasion"}
                          </Text>
                          <Text style={styles.addMoreSubtext}>
                            {outfits.length} outfits ready to add
                          </Text>
                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                              if (entry.isDaily) {
                                // For daily, use daily mode
                                setCalendarModalMode("daily");
                                setSelectedOccasionIdForCalendar(undefined);
                                setIsAddCalendarModalVisible(true);
                              } else {
                                // For occasion, use normal mode with occasionId
                                handleAddOutfitToOccasion(occasion.id);
                              }
                            }}
                          >
                            <Ionicons name="add" size={20} color="#ffffff" />
                            <Text style={styles.addButtonText}>Select outfits</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Modals */}
        <AddOccasionModal
          visible={isAddOccasionModalVisible}
          selectedDate={selectedDate}
          onClose={() => setIsAddOccasionModalVisible(false)}
          onSuccess={handleAddOccasionSuccess}
          onCreateOccasion={createUserOccasion}
        />

        <EditOccasionModal
          visible={isEditOccasionModalVisible}
          occasion={editingOccasion}
          onClose={() => {
            setIsEditOccasionModalVisible(false);
            setEditingOccasion(null);
          }}
          onSuccess={handleEditOccasionSuccess}
          onUpdateOccasion={updateUserOccasion}
        />

        <AddCalendarModal
          visible={isAddCalendarModalVisible}
          selectedDate={selectedDate}
          mode={calendarModalMode}
          userOccasionId={selectedOccasionIdForCalendar}
          userOccasions={userOccasionsForDate}
          outfits={outfits}
          calendarEntries={calendarEntriesProp}
          onLoadMore={onLoadMoreOutfits}
          hasMore={hasMoreOutfits}
          loadingMore={loadingMoreOutfits}
          onClose={() => setIsAddCalendarModalVisible(false)}
          onSubmit={handleAddCalendarSubmit}
        />
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
  summaryBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.2)",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15,23,42,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.3)",
  },
  actionButtonPrimary: {
    backgroundColor: "#38bdf8",
    borderColor: "#38bdf8",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38bdf8",
  },
  actionButtonTextPrimary: {
    color: "#ffffff",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(226,232,240,0.5)",
    marginTop: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 13,
    color: "rgba(226,232,240,0.4)",
    marginTop: 8,
  },
  occasionsList: {
    gap: 12,
  },
  occasionCard: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    overflow: "hidden",
  },
  occasionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  occasionHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  occasionInfo: {
    flex: 1,
    gap: 8,
  },
  occasionBadges: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  occasionTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(167,139,250,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  occasionTypeText: {
    fontSize: 12,
    color: "#a78bfa",
    fontWeight: "600",
  },
  outfitCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(56,189,248,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outfitCountText: {
    fontSize: 12,
    color: "#38bdf8",
    fontWeight: "600",
  },
  occasionName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  occasionDescription: {
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
  },
  occasionActions: {
    flexDirection: "row",
    gap: 8,
  },
  occasionActionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  plannedOutfitsSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  outfitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  outfitCard: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
  },
  outfitImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  outfitImageContainer: {
    width: "48%",
    aspectRatio: 1,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "rgba(15,23,42,0.6)",
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
  },
  outfitItemsCount: {
    fontSize: 12,
    color: "#94a3b8",
  },
  removeButton: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  removeButtonText: {
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "700",
  },
  emptyOutfitsSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15,23,42,0.4)",
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyOutfitsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(226,232,240,0.6)",
    marginTop: 12,
  },
  emptyOutfitsSubtext: {
    fontSize: 12,
    color: "rgba(226,232,240,0.4)",
    marginTop: 4,
  },
  addMoreSection: {
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  addMoreSubtext: {
    fontSize: 12,
    color: "#94a3b8",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});

