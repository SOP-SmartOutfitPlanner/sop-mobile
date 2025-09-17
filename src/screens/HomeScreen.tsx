import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
import {
  useCurrentUser,
  useWeather,
  useSchedule,
  useDailyOutfit,
} from "../hooks/useMockData";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useCurrentUser();
  const { data: weather } = useWeather();
  const { events } = useSchedule();
  const { main: outfit } = useDailyOutfit();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getDressCodeColor = (dressCode: string) => {
    switch (dressCode.toLowerCase()) {
      case "formal":
        return styles.tagFormal;
      case "smart":
        return styles.tagSmart;
      case "sport":
        return styles.tagSport;
      case "rainy":
        return styles.tagRainy;
      default:
        return styles.tagCasual;
    }
  };

  const renderAvatar = () => {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    if (user.avatarUrl) {
      return <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />;
    }

    return (
      <View style={[styles.avatar, styles.avatarFallback]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Greeting Card */}
        <View style={styles.card}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}, Minh</Text>
            {renderAvatar()}
          </View>
        </View>

        {/* Weather Card */}
        <View style={styles.card}>
          <View style={styles.weatherHeader}>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weather.temp}°</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
            </View>
            <View style={[styles.badge, styles.tagCasual]}>
              <Text style={styles.badgeText}>{weather.condition}</Text>
            </View>
          </View>

          <View style={styles.weatherDetails}>
            <Text style={styles.weatherDetailText}>
              Feels {weather.feelsLike}°
            </Text>
            <Text style={styles.weatherDetailText}>
              Rain {weather.rainChance}%
            </Text>
            <Text style={styles.weatherDetailText}>UV {weather.uv}</Text>
          </View>
        </View>

        {/* Schedule Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>

          <View style={styles.scheduleContainer}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventContent}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{event.time}</Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.badge, getDressCodeColor(event.dressCode)]}
                >
                  <Text style={styles.badgeText}>{event.dressCode}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Outfit Preview */}
        {outfit && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Today's Recommended Outfit</Text>

            <View style={styles.outfitGrid}>
              {outfit.items.slice(0, 3).map((item, index) => (
                <View key={item.id} style={styles.outfitItem}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.outfitImage}
                    resizeMode="cover"
                  />
                  <View style={styles.outfitNumber}>
                    <Text style={styles.outfitNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.matchScore}>
              <Text style={styles.matchScoreText}>
                Match Score:{" "}
                <Text style={styles.scoreValue}>{outfit.score}%</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Planner")}
            >
              <Text style={styles.buttonText}>Get Full Outfit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Navigation Grid */}
        <View style={styles.navigationGrid}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Wardrobe")}
          >
            <Text style={styles.navTitle}>Wardrobe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Community")}
          >
            <Text style={styles.navTitle}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Collection")}
          >
            <Text style={styles.navTitle}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navTitle}>Challenges</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 12,
    paddingBottom: 32,
    paddingTop: 35,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 14,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f46e5",
    marginRight: 8,
  },
  condition: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherDetailText: {
    fontSize: 12,
    color: "#64748b",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 12,
  },
  scheduleContainer: {
    maxHeight: 160,
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    minHeight: 56,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4f46e5",
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  tagCasual: {
    backgroundColor: "#64748b",
  },
  tagFormal: {
    backgroundColor: "#1e293b",
  },
  tagSmart: {
    backgroundColor: "#4f46e5",
  },
  tagSport: {
    backgroundColor: "#059669",
  },
  tagRainy: {
    backgroundColor: "#0ea5e9",
  },
  outfitGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  outfitItem: {
    position: "relative",
    width: (width - 60) / 3,
    aspectRatio: 1,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  outfitNumber: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  outfitNumberText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  matchScore: {
    marginBottom: 12,
  },
  matchScoreText: {
    fontSize: 12,
    color: "#64748b",
  },
  scoreValue: {
    fontWeight: "600",
    color: "#f59e0b",
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  navigationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  navItem: {
    backgroundColor: "white",
    borderRadius: 16,
    width: (width - 36) / 2,
    height: 80,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 4,
  },
});

export default HomeScreen;
