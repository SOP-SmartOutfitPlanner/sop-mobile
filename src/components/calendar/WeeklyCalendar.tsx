import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Helper functions to replace date-fns
const format = (date: Date, formatStr: string): string => {
  if (formatStr === "EEE") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }
  if (formatStr === "d") return date.getDate().toString();
  if (formatStr === "MMM") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()];
  }
  if (formatStr === "yyyy-MM-dd") {
    return date.toISOString().split('T')[0];
  }
  if (formatStr === "yyyy") return date.getFullYear().toString();
  if (formatStr === "II") {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7).toString();
  }
  return date.toString();
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

const addWeeks = (date: Date, weeks: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
};

const subWeeks = (date: Date, weeks: number): Date => {
  return addWeeks(date, -weeks);
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
import { UserOccasion } from "../../types/userOccasion";

interface WeeklyCalendarProps {
  calendarEntries: CalendarEntry[];
  userOccasions?: UserOccasion[];
  onDayPress: (date: Date) => void;
  onShowMonthView?: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  calendarEntries,
  userOccasions = [],
  onDayPress,
  onShowMonthView,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getDayInfo = (day: Date) => {
    const dayString = format(day, "yyyy-MM-dd");

    const dayEntries = calendarEntries.filter((entry) => {
      // Use dateOccasion directly, extract date part to avoid timezone issues
      const occasionDate = extractDateString(entry.userOccasion.dateOccasion);
      return occasionDate === dayString;
    });

    const dayOccasions = userOccasions.filter((occ) => {
      // Use dateOccasion directly, extract date part to avoid timezone issues
      const occasionDate = extractDateString(occ.dateOccasion);
      return occasionDate === dayString;
    });

    const occasionsWithOutfits = new Set(
      dayEntries.map((entry) => entry.userOccasion.id)
    );

    const occasionsWithoutOutfits = dayOccasions.filter(
      (occ) => !occasionsWithOutfits.has(occ.id)
    );

    const totalOutfits = dayEntries.reduce(
      (sum, entry) => sum + entry.outfits.length,
      0
    );

    return {
      entries: dayEntries,
      occasions: dayOccasions,
      occasionsWithoutOutfits,
      totalOutfits,
      hasOccasions: dayOccasions.length > 0,
      hasOutfits: totalOutfits > 0,
    };
  };

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Weekly Outfit Planner</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
             {format(currentDate, "yyyy")}-W{format(currentDate, "II")}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {onShowMonthView && (
            <TouchableOpacity 
              style={styles.monthButton} 
              onPress={onShowMonthView}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color="#38bdf8" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.navButton} onPress={handlePrevWeek} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNextWeek} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekly Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.weekGrid}>
          {weekDays.map((day: Date, index: number) => {
            const dayInfo = getDayInfo(day);
            const isCurrentDay = isToday(day);
            const dayName = format(day, "EEE");
            const dayDate = format(day, "d");
            const monthName = format(day, "MMM");

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCard,
                  isCurrentDay && styles.dayCardToday,
                ]}
                onPress={() => onDayPress(day)}
              >
                {/* Day Header */}
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{dayName}</Text>
                  <Text style={styles.dayDate}>{monthName} {dayDate}</Text>
                </View>

                {/* Content */}
                <ScrollView 
                  style={styles.contentScroll}
                  contentContainerStyle={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {!dayInfo.hasOccasions && !dayInfo.hasOutfits ? (
                    <View style={styles.emptyState}>
                      <View style={styles.addIcon}>
                        <Ionicons name="add" size={24} color="rgba(255,255,255,0.4)" />
                      </View>
                      <Text style={styles.addText}>Add Outfit</Text>
                    </View>
                  ) : (
                    <View style={styles.content}>
                      {/* Daily Outfits (isDaily: true) */}
                      {dayInfo.entries
                        .filter((entry) => entry && entry.isDaily)
                        .map((entry) => {
                          if (!entry) return null;
                          return (
                            <View key={`daily-${entry.userOccasion.id}`} style={styles.occasionCard}>
                              {/* Daily Header */}
                              <View style={styles.occasionHeader}>
                                <View style={[styles.occasionTypeBadge, styles.occasionTypeBadgeDaily]}>
                                  <View style={[styles.occasionTypeDot, styles.occasionTypeDotDaily]} />
                                  <Text style={[styles.occasionTypeText, styles.occasionTypeTextDaily]} numberOfLines={1}>
                                    Daily
                                  </Text>
                                </View>
                              </View>

                            {/* Daily Outfits */}
                            {entry.outfits && entry.outfits.length > 0 && (
                              <View style={styles.outfitsList}>
                                {entry.outfits.slice(0, 2).map((outfitEntry) => {
                                  if (!outfitEntry) return null;
                                  const items = outfitEntry.outfitDetails?.items || [];
                                  const itemCount = items.length;

                                  return (
                                    <View key={outfitEntry.calendarId || outfitEntry.outfitId} style={styles.outfitCard}>
                                      {/* Outfit Images Grid */}
                                      {itemCount > 0 && (
                                        <View style={styles.outfitImagesGrid}>
                                          {items.slice(0, 4).map((item, idx) => {
                                            if (!item) return null;
                                            return (
                                              <View key={item.itemId || idx} style={styles.outfitImageContainer}>
                                                {item.imgUrl ? (
                                                  <Image
                                                    source={{ uri: item.imgUrl }}
                                                    style={styles.outfitImage}
                                                  />
                                                ) : (
                                                  <View style={styles.outfitImagePlaceholder}>
                                                    <Ionicons name="shirt-outline" size={16} color="#94a3b8" />
                                                  </View>
                                                )}
                                              </View>
                                            );
                                          })}
                                        </View>
                                      )}
                                      
                                      {/* Outfit Info */}
                                      <Text style={styles.outfitName} numberOfLines={1}>
                                        {outfitEntry.outfitName || "Untitled Outfit"}
                                      </Text>
                                      <Text style={styles.outfitItemsCount}>
                                        {itemCount} items
                                      </Text>
                                    </View>
                                  );
                                })}
                                
                                {/* Show "X more" if there are more outfits */}
                                {entry.outfits.length > 2 && (
                                  <View style={styles.moreOutfitsBadge}>
                                    <Text style={styles.moreOutfitsText}>
                                      +{entry.outfits.length - 2} more
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                            </View>
                          );
                        })}

                      {/* Occasions (isDaily: false) */}
                      {dayInfo.entries
                        .filter((entry) => entry && !entry.isDaily)
                        .map((entry) => {
                          if (!entry) return null;
                          const occasion = entry.userOccasion;
                          const hasOutfits = entry.outfits && entry.outfits.length > 0;

                          return (
                            <View key={occasion.id} style={styles.occasionCard}>
                              {/* Occasion Header */}
                              <View style={styles.occasionHeader}>
                                <View style={styles.occasionTypeBadge}>
                                  <View style={styles.occasionTypeDot} />
                                  <Text style={styles.occasionTypeText} numberOfLines={1}>
                                    {occasion.occasionName}
                                  </Text>
                                </View>
                              </View>
                              <Text style={styles.occasionName} numberOfLines={1}>
                                {occasion.name}
                              </Text>

                              {/* Outfits for this occasion */}
                              {hasOutfits && (
                                <View style={styles.outfitsList}>
                                  {entry.outfits.slice(0, 2).map((outfitEntry) => {
                                    if (!outfitEntry) return null;
                                    const items = outfitEntry.outfitDetails?.items || [];
                                    const itemCount = items.length;

                                    return (
                                      <View key={outfitEntry.calendarId || outfitEntry.outfitId} style={styles.outfitCard}>
                                        {/* Outfit Images Grid */}
                                        {itemCount > 0 && (
                                          <View style={styles.outfitImagesGrid}>
                                            {items.slice(0, 4).map((item, idx) => {
                                              if (!item) return null;
                                              return (
                                                <View key={item.itemId || idx} style={styles.outfitImageContainer}>
                                                  {item.imgUrl ? (
                                                    <Image
                                                      source={{ uri: item.imgUrl }}
                                                      style={styles.outfitImage}
                                                    />
                                                  ) : (
                                                    <View style={styles.outfitImagePlaceholder}>
                                                      <Ionicons name="shirt-outline" size={16} color="#94a3b8" />
                                                    </View>
                                                  )}
                                                </View>
                                              );
                                            })}
                                          </View>
                                        )}
                                        
                                        {/* Outfit Info */}
                                        <Text style={styles.outfitName} numberOfLines={1}>
                                          {outfitEntry.outfitName || "Untitled Outfit"}
                                        </Text>
                                        <Text style={styles.outfitItemsCount}>
                                          {itemCount} items
                                        </Text>
                                      </View>
                                    );
                                  })}
                                  
                                  {/* Show "X more" if there are more outfits */}
                                  {entry.outfits.length > 2 && (
                                    <View style={styles.moreOutfitsBadge}>
                                      <Text style={styles.moreOutfitsText}>
                                        +{entry.outfits.length - 2} more
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          );
                        })}

                      {/* Occasions without outfits (from userOccasions prop, not in calendarEntries) */}
                      {dayInfo.occasionsWithoutOutfits.map((occasion) => (
                        <View key={occasion.id} style={styles.occasionCard}>
                          <View style={styles.occasionHeader}>
                            <View style={styles.occasionTypeBadge}>
                              <View style={styles.occasionTypeDot} />
                              <Text style={styles.occasionTypeText} numberOfLines={1}>
                                {occasion.occasionName}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.occasionName} numberOfLines={1}>
                            {occasion.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>

                {/* Today Indicator */}
                {isCurrentDay && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Today</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(226,232,240,0.7)",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(56,189,248,0.15)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.3)",
    alignItems: "center",
    justifyContent: "center",
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
  scrollView: {
    paddingHorizontal: 16,
  },
  weekGrid: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 16,
  },
  dayCard: {
    width: 160,
    minHeight: 320,
    maxHeight: 500,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  dayCardToday: {
    borderColor: "#38bdf8",
    borderWidth: 2,
    backgroundColor: "rgba(56,189,248,0.15)",
  },
  dayHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  dayName: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(226,232,240,0.9)",
    marginBottom: 3,
  },
  dayDate: {
    fontSize: 12,
    color: "rgba(226,232,240,0.7)",
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  addIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  addText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },
  content: {
    gap: 12,
  },
  occasionCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
    marginBottom: 2,
  },
  occasionHeader: {
    marginBottom: 8,
  },
  occasionTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  occasionTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#a78bfa",
  },
  occasionTypeDotDaily: {
    backgroundColor: "#38bdf8",
  },
  occasionTypeText: {
    fontSize: 11,
    color: "#a78bfa",
    fontWeight: "600",
  },
  occasionTypeTextDaily: {
    color: "#38bdf8",
  },
  occasionTypeBadgeDaily: {
    // Additional styling for daily badge if needed
  },
  occasionName: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 8,
  },
  outfitsList: {
    gap: 10,
    marginTop: 6,
  },
  outfitCard: {
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    position: "relative",
  },
  outfitImagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 8,
  },
  outfitImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(148,163,184,0.2)",
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  outfitImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148,163,184,0.1)",
  },
  outfitName: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 3,
  },
  outfitItemsCount: {
    fontSize: 10,
    color: "rgba(226,232,240,0.7)",
  },
  moreOutfitsBadge: {
    backgroundColor: "rgba(56,189,248,0.2)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.3)",
  },
  moreOutfitsText: {
    fontSize: 10,
    color: "#38bdf8",
    fontWeight: "600",
  },
  todayBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#38bdf8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  todayBadgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "700",
  },
});

