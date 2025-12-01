import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Helper functions to replace date-fns
const format = (date: Date, formatStr: string): string => {
  if (formatStr === "MMMM yyyy") {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  if (formatStr === "d") return date.getDate().toString();
  if (formatStr === "yyyy-MM-dd") {
    return date.toISOString().split('T')[0];
  }
  return date.toString();
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const endOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
};

const eachDayOfInterval = ({ start, end }: { start: Date; end: Date }): Date[] => {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Helper to extract date string from dateOccasion (handles timezone issues)
const extractDateString = (dateOccasion: string): string => {
  // dateOccasion format: "2025-11-28T00:00:00"
  // Extract just the date part (yyyy-MM-dd) to avoid timezone issues
  if (!dateOccasion) return "";
  const datePart = dateOccasion.split("T")[0];
  return datePart;
};

import { CalendarEntry } from "../../types/calendar";

interface MonthlyCalendarProps {
  calendarEntries: CalendarEntry[];
  onDayPress: (date: Date) => void;
  onShowWeekView?: () => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  calendarEntries,
  onDayPress,
  onShowWeekView,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayInfo = (day: Date) => {
    const dayString = format(day, "yyyy-MM-dd");

    const dayEntries = calendarEntries.filter((entry) => {
      // Use dateOccasion directly, extract date part to avoid timezone issues
      const occasionDate = extractDateString(entry.userOccasion.dateOccasion);
      return occasionDate === dayString;
    });

    const totalOutfits = dayEntries.reduce(
      (sum, entry) => sum + entry.outfits.length,
      0
    );

    const hasDaily = dayEntries.some((e) => e.isDaily);
    const hasOccasions = dayEntries.some((e) => !e.isDaily);
    const occasionCount = dayEntries.filter((e) => !e.isDaily).length;

    return {
      entries: dayEntries,
      hasOccasions: dayEntries.length > 0,
      hasOutfits: totalOutfits > 0,
      outfitCount: totalOutfits,
      hasDaily,
      occasionCount,
    };
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{format(currentDate, "MMMM yyyy")}</Text>
        </View>
        <View style={styles.headerActions}>
          {onShowWeekView && (
            <TouchableOpacity style={styles.actionButton} onPress={onShowWeekView}>
              <Ionicons name="grid-outline" size={18} color="#94a3b8" />
              <Text style={styles.actionButtonText}>Week</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleToday}>
            <Text style={styles.actionButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Day Names */}
        <View style={styles.dayNamesRow}>
          {dayNames.map((day) => (
            <View key={day} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            const dayInfo = getDayInfo(day);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !isCurrentMonth && styles.dayCellOtherMonth,
                  isCurrentDay && styles.dayCellToday,
                  dayInfo.hasOutfits && styles.dayCellWithOutfits,
                ]}
                onPress={() => onDayPress(day)}
              >
                <View style={styles.dayCellHeader}>
                  <Text
                    style={[
                      styles.dayNumber,
                      !isCurrentMonth && styles.dayNumberOtherMonth,
                    ]}
                  >
                    {format(day, "d")}
                  </Text>
                  {isCurrentMonth && dayInfo.entries.length > 0 && (
                    <View style={styles.indicatorDot}>
                      {dayInfo.hasDaily && (
                        <View style={[styles.indicator, styles.indicatorDaily]} />
                      )}
                      {dayInfo.hasOccasions && (
                        <View style={[styles.indicator, styles.indicatorOccasion]} />
                      )}
                    </View>
                  )}
                </View>

                {/* Event Blocks */}
                {isCurrentMonth && dayInfo.entries.length > 0 && (
                  <View style={styles.eventBlocks}>
                    {dayInfo.entries.slice(0, 2).map((entry, idx) => {
                      const isDaily = entry.isDaily;
                      const timeStr = entry.userOccasion.startTime
                        ? new Date(entry.userOccasion.startTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: false,
                          }) +
                          (entry.userOccasion.endTime
                            ? "-" +
                              new Date(entry.userOccasion.endTime).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "")
                        : "";
                      const eventText = isDaily
                        ? `• Daily ${entry.outfits.length}`
                        : timeStr
                        ? `• ${timeStr} ${entry.userOccasion.name.substring(0, 8)}`
                        : `• ${entry.userOccasion.name.substring(0, 10)}`;

                      return (
                        <View
                          key={idx}
                          style={[
                            styles.eventBlock,
                            isDaily ? styles.eventBlockDaily : styles.eventBlockOccasion,
                          ]}
                        >
                          <Text
                            style={[
                              styles.eventText,
                              isDaily ? styles.eventTextDaily : styles.eventTextOccasion,
                            ]}
                            numberOfLines={1}
                          >
                            {eventText}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotDaily]} />
            <Text style={styles.legendText}>Daily Outfit</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotOccasion]} />
            <Text style={styles.legendText}>Occasions</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotToday]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  actionButtonText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarContainer: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    marginHorizontal: 16,
  },
  dayNamesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(226,232,240,0.7)",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    minHeight: 80,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    margin: 2,
    justifyContent: "flex-start",
  },
  dayCellOtherMonth: {
    opacity: 0.5,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  dayCellToday: {
    borderColor: "#38bdf8",
    borderWidth: 2,
    backgroundColor: "rgba(56,189,248,0.2)",
  },
  dayCellWithOutfits: {
    borderColor: "rgba(167,139,250,0.4)",
  },
  dayCellHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  indicatorDot: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  dayNumberOtherMonth: {
    color: "rgba(226,232,240,0.5)",
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  indicatorDaily: {
    backgroundColor: "#38bdf8",
  },
  indicatorOccasion: {
    backgroundColor: "#a78bfa",
  },
  occasionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  occasionCount: {
    fontSize: 9,
    color: "#a78bfa",
    fontWeight: "700",
  },
  eventBlocks: {
    gap: 3,
    marginTop: 2,
  },
  eventBlock: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  eventBlockDaily: {
    backgroundColor: "rgba(56,189,248,0.2)",
  },
  eventBlockOccasion: {
    backgroundColor: "rgba(167,139,250,0.2)",
  },
  eventText: {
    fontSize: 9,
    fontWeight: "600",
    lineHeight: 12,
  },
  eventTextDaily: {
    color: "#38bdf8",
  },
  eventTextOccasion: {
    color: "#a78bfa",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.2)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendDotDaily: {
    backgroundColor: "#38bdf8",
  },
  legendDotOccasion: {
    backgroundColor: "#a78bfa",
  },
  legendDotToday: {
    backgroundColor: "#38bdf8",
  },
  legendText: {
    fontSize: 12,
    color: "rgba(226,232,240,0.7)",
    fontWeight: "500",
  },
});

