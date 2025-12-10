import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format, addDays } from "date-fns";
import { CalenderAPI } from "../../services/endpoint/calendar";
import { UserOccasion } from "../../types/userOccasion";
import { CalendarEntry } from "../../types/calendar";

interface UserOccasionsListProps {
  selectedDate: Date;
  selectedOccasionId: number | null;
  onOccasionSelect: (occasionId: number | null) => void;
  onCreatePress?: () => void;
}

const UserOccasionsList: React.FC<UserOccasionsListProps> = ({
  selectedDate,
  selectedOccasionId,
  onOccasionSelect,
  onCreatePress,
}) => {
  const [occasions, setOccasions] = useState<Array<{
    occasion: UserOccasion;
    outfitCount: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user occasions for selected date
  useEffect(() => {
    const fetchOccasions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const nextDateString = format(addDays(selectedDate, 1), "yyyy-MM-dd");

        const response = await CalenderAPI.getCalendarEntries({
          PageIndex: 1,
          PageSize: 100,
          takeAll: true,
          StartDate: dateString,
          EndDate: nextDateString,
        });

        if (response.statusCode === 200 && response.data?.data) {
          // Extract unique occasions from calendar entries
          const entries = response.data.data;
          const occasionsMap = new Map<number, { occasion: UserOccasion; outfitCount: number }>();

          entries.forEach((entry: CalendarEntry) => {
            if (entry.userOccasion && !entry.isDaily) {
              const occasionId = entry.userOccasion.id;
              if (!occasionsMap.has(occasionId)) {
                occasionsMap.set(occasionId, {
                  occasion: entry.userOccasion as unknown as UserOccasion,
                  outfitCount: entry.outfits?.length || 0,
                });
              } else {
                // Accumulate outfit count
                const existing = occasionsMap.get(occasionId)!;
                existing.outfitCount += entry.outfits?.length || 0;
              }
            }
          });

          setOccasions(Array.from(occasionsMap.values()));
        }
      } catch (err: any) {
        console.error("Failed to fetch user occasions:", err);
        setError("Failed to load occasions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccasions();
  }, [selectedDate]);

  // Format time display
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    // Handle both HH:mm:ss and full datetime formats
    if (timeStr.includes("T")) {
      const timePart = timeStr.split("T")[1];
      return timePart.substring(0, 5);
    }
    return timeStr.substring(0, 5);
  };

  const handleOccasionPress = (occasionId: number) => {
    // Toggle selection
    if (selectedOccasionId === occasionId) {
      onOccasionSelect(null);
    } else {
      onOccasionSelect(occasionId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Events</Text>
        {onCreatePress && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreatePress}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#22D3EE" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !error && occasions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No events scheduled</Text>
          <Text style={styles.emptySubtitle}>
            Create an event to get personalized outfit suggestions
          </Text>
        </View>
      )}

      {/* Occasions List */}
      {!isLoading && !error && occasions.length > 0 && (
        <View style={styles.listContainer}>
          {occasions.map(({ occasion, outfitCount }) => {
            const isSelected = selectedOccasionId === occasion.id;

            return (
              <TouchableOpacity
                key={occasion.id}
                style={[
                  styles.occasionCard,
                  isSelected && styles.occasionCardSelected,
                ]}
                onPress={() => handleOccasionPress(occasion.id)}
                activeOpacity={0.7}
              >
                {/* Selection indicator */}
                {isSelected && <View style={styles.selectionIndicator} />}

                {/* Occasion Badge */}
                <View style={styles.occasionBadge}>
                  <Text style={styles.occasionBadgeText}>
                    {occasion.occasionName}
                  </Text>
                </View>

                {/* Occasion Name */}
                <Text style={styles.occasionName} numberOfLines={1}>
                  {occasion.name}
                </Text>

                {/* Time */}
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={16} color="#22D3EE" />
                  <Text style={styles.timeText}>
                    {formatTime(occasion.startTime)} → {formatTime(occasion.endTime)}
                  </Text>
                </View>

                {/* Outfit Count */}
                <View style={styles.outfitCountRow}>
                  <Ionicons name="shirt-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.outfitCountText}>
                    {outfitCount} {outfitCount === 1 ? "outfit" : "outfits"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Selected occasion info */}
      {selectedOccasionId && (
        <View style={styles.selectedInfo}>
          <Ionicons name="checkmark-circle" size={16} color="#22D3EE" />
          <Text style={styles.selectedInfoText}>
            Outfit will be suggested for this event
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Loading
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  // Error
  errorContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  // Empty
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  // List
  listContainer: {
    gap: 12,
  },
  occasionCard: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  occasionCardSelected: {
    borderColor: "rgba(34, 211, 238, 0.5)",
    backgroundColor: "rgba(34, 211, 238, 0.1)",
  },
  selectionIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    marginTop: -16,
    width: 4,
    height: 32,
    backgroundColor: "#22D3EE",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  occasionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(34, 211, 238, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  occasionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22D3EE",
  },
  occasionName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    backgroundColor: "rgba(34, 211, 238, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  outfitCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
  },
  outfitCountText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  // Selected info
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(34, 211, 238, 0.1)",
    borderRadius: 8,
  },
  selectedInfoText: {
    fontSize: 13,
    color: "#22D3EE",
  },
});

export default UserOccasionsList;
