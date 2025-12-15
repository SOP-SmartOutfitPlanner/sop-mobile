import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

interface UserEvent {
  id: string;
  occasionId: string;
  occasionName: string;
  note?: string;
  date: string;
  time?: string;
}

interface CompactUserEventsProps {
  events: UserEvent[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string, occasionId: string) => void;
  isLoading?: boolean;
  onCreatePress?: () => void;
}

const CompactUserEvents: React.FC<CompactUserEventsProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  isLoading,
  onCreatePress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar-outline" size={14} color="#22D3EE" />
          <Text style={styles.headerText}>Your Events</Text>
        </View>
        {onCreatePress && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreatePress}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color="#22D3EE" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No events scheduled</Text>
        </View>
      ) : (
        <View style={styles.eventsList}>
          {events.map((event) => {
            const isSelected = selectedEventId === event.id;
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventChip, isSelected && styles.eventChipSelected]}
                onPress={() => onSelectEvent(event.id, event.occasionId)}
                activeOpacity={0.7}
              >
                <View style={styles.eventContent}>
                  <Text
                    style={[
                      styles.eventName,
                      isSelected && styles.eventNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {event.occasionName}
                  </Text>
                  {event.time && (
                    <Text style={styles.eventTime}>
                      {format(new Date(event.time), "HH:mm")}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  loadingContainer: {
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#22D3EE",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(34, 211, 238, 0.12)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.25)",
  },
  createButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22D3EE",
  },
  emptyState: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },
  eventsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  eventChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  eventChipSelected: {
    backgroundColor: "#22D3EE",
    borderColor: "#22D3EE",
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  eventNameSelected: {
    color: "#0f172a",
  },
  eventTime: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CompactUserEvents;
