import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Text } from "react-native";
import { Header } from "../components/common/Header";
import { WeeklyCalendar } from "../components/calendar/WeeklyCalendar";
import { MonthlyCalendar } from "../components/calendar/MonthlyCalendar";
import { CalendarDayDetailModal } from "../components/calendar/CalendarDayDetailModal";
import { useCalendar } from "../hooks/calendar/useCalendar";
import { useOutfits } from "../hooks/outfit/useOutfits";

type ViewMode = "week" | "month";

const CalendarScreen = ({ navigation }: any) => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const {
    calendarEntries,
    loading,
    fetchCalendarEntries,
    useOutfitToday,
  } = useCalendar();

  const { outfits } = useOutfits();

  // Fetch calendar entries on mount
  useEffect(() => {
    const today = new Date();
    fetchCalendarEntries({
      Year: today.getFullYear(),
      Month: today.getMonth() + 1,
    });
  }, [fetchCalendarEntries]);

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalVisible(false);
    setSelectedDate(null);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const handleMessagePress = () => {
    // Handle message
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  if (loading && calendarEntries.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Outfit Calendar"
          showBackButton={true}
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
          onProfilePress={handleProfilePress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading calendar...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Outfit Calendar"
        showBackButton={true}
        onBackPress={handleBackPress}
        onNotificationPress={handleNotificationPress}
        onMessagePress={handleMessagePress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              // Fetch all entries to ensure we have the latest data
              fetchCalendarEntries({ takeAll: true });
            }}
          />
        }
      >
        {viewMode === "week" ? (
          <WeeklyCalendar
            calendarEntries={calendarEntries}
            onDayPress={handleDayPress}
            onShowMonthView={() => setViewMode("month")}
          />
        ) : (
          <MonthlyCalendar
            calendarEntries={calendarEntries}
            onDayPress={handleDayPress}
            onShowWeekView={() => setViewMode("week")}
          />
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <CalendarDayDetailModal
        visible={isDetailModalVisible}
        selectedDate={selectedDate}
        onClose={handleCloseDetail}
        calendarEntries={calendarEntries}
        outfits={outfits}
        onRefresh={async () => {
          // Fetch all calendar entries to ensure we have the latest data
          await fetchCalendarEntries({ takeAll: true });
        }}
      />
    </View>
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
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  bottomSpacing: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
});

export default CalendarScreen;

