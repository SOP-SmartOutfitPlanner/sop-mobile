import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PlannerScreen = () => {
  const today = new Date();
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch Trình Outfit</Text>
        <Text style={styles.subtitle}>Lên kế hoạch trang phục hàng ngày</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Tuần Này</Text>
          <View style={styles.weekCalendar}>
            {weekDays.map((day, index) => {
              const date = new Date(today);
              date.setDate(today.getDate() - today.getDay() + index);
              const isToday = date.toDateString() === today.toDateString();

              return (
                <View
                  key={index}
                  style={[styles.dayCard, isToday && styles.todayCard]}
                >
                  <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                    {day}
                  </Text>
                  <Text style={[styles.dateLabel, isToday && styles.todayDate]}>
                    {date.getDate()}
                  </Text>
                  <View style={styles.outfitPreview}>
                    {index === today.getDay() ? (
                      <Text style={styles.outfitEmoji}>👔</Text>
                    ) : index === (today.getDay() + 1) % 7 ? (
                      <Text style={styles.outfitEmoji}>👗</Text>
                    ) : (
                      <Text style={styles.addOutfit}>+</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hôm Nay</Text>
          <View style={styles.todayOutfit}>
            <View style={styles.currentOutfit}>
              <Text style={styles.currentOutfitTitle}>Outfit Hiện Tại</Text>
              <View style={styles.outfitItems}>
                <View style={styles.outfitItem}>
                  <Text style={styles.itemEmoji}>👔</Text>
                  <Text style={styles.itemName}>Blazer Xanh Navy</Text>
                </View>
                <View style={styles.outfitItem}>
                  <Text style={styles.itemEmoji}>👔</Text>
                  <Text style={styles.itemName}>Áo Sơ Mi Trắng</Text>
                </View>
                <View style={styles.outfitItem}>
                  <Text style={styles.itemEmoji}>👖</Text>
                  <Text style={styles.itemName}>Quần Âu Đen</Text>
                </View>
                <View style={styles.outfitItem}>
                  <Text style={styles.itemEmoji}>👞</Text>
                  <Text style={styles.itemName}>Giày Oxford</Text>
                </View>
              </View>
              <View style={styles.outfitMeta}>
                <Text style={styles.weatherInfo}>🌤️ 22°C • Nắng ít mây</Text>
                <Text style={styles.occasionInfo}>💼 Đi làm</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gợi Ý Outfit</Text>
          <View style={styles.suggestions}>
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>Casual Weekend</Text>
              <View style={styles.suggestionItems}>
                <Text style={styles.suggestionEmoji}>👕👖👟</Text>
              </View>
              <Text style={styles.suggestionDesc}>Hoàn hảo cho cuối tuần</Text>
            </View>

            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>Date Night</Text>
              <View style={styles.suggestionItems}>
                <Text style={styles.suggestionEmoji}>👗👠💍</Text>
              </View>
              <Text style={styles.suggestionDesc}>Lãng mạn và quyến rũ</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch Sự Kiện</Text>
          <View style={styles.events}>
            <View style={styles.eventItem}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>18</Text>
                <Text style={styles.eventMonth}>Th9</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Họp Quan Trọng</Text>
                <Text style={styles.eventTime}>14:00 - 16:00</Text>
                <Text style={styles.eventDress}>👔 Formal Business</Text>
              </View>
            </View>

            <View style={styles.eventItem}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>20</Text>
                <Text style={styles.eventMonth}>Th9</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Tiệc Sinh Nhật</Text>
                <Text style={styles.eventTime}>19:00 - 23:00</Text>
                <Text style={styles.eventDress}>🎉 Smart Casual</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#20c997",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  weekCalendar: {
    flexDirection: "row",
    gap: 8,
  },
  dayCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayCard: {
    backgroundColor: "#20c997",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  todayLabel: {
    color: "white",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  todayDate: {
    color: "white",
  },
  outfitPreview: {
    marginTop: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  outfitEmoji: {
    fontSize: 16,
  },
  addOutfit: {
    fontSize: 18,
    color: "#20c997",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  todayOutfit: {
    marginBottom: 16,
  },
  currentOutfit: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentOutfitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  outfitItems: {
    gap: 12,
    marginBottom: 16,
  },
  outfitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  outfitMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f3f4",
  },
  weatherInfo: {
    fontSize: 14,
    color: "#666",
  },
  occasionInfo: {
    fontSize: 14,
    color: "#666",
  },
  suggestions: {
    flexDirection: "row",
    gap: 12,
  },
  suggestionCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  suggestionItems: {
    marginBottom: 8,
  },
  suggestionEmoji: {
    fontSize: 24,
  },
  suggestionDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  events: {
    gap: 12,
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventDate: {
    width: 50,
    alignItems: "center",
    marginRight: 16,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#20c997",
  },
  eventMonth: {
    fontSize: 12,
    color: "#666",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventDress: {
    fontSize: 14,
    color: "#20c997",
  },
});

export default PlannerScreen;
