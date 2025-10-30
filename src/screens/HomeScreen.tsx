import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Header } from "../components/common";
import {
  TodayOutfit,
  YourFavorites,
  TrendingCommunity,
  QuickNavigation,
} from "../components/home";
import { useAuth } from "../hooks/auth";
import { GuestPrompt } from "../components/notification/GuestPrompt";

export default function HomeScreen({ navigation }: any) {
  const { isGuest } = useAuth();
  const [guestPromptVisible, setGuestPromptVisible] = useState(false);
  const [guestFeature, setGuestFeature] = useState("");

  const showGuestPrompt = (feature: string) => {
    setGuestFeature(feature);
    setGuestPromptVisible(true);
  };

  const handleLogin = () => {
    setGuestPromptVisible(false);
    navigation.navigate("Auth", { screen: "Login" });
  };

  const handleNotificationPress = () => {
    if (isGuest) {
      showGuestPrompt("notifications");
    } else {
      console.log("Notification pressed");
    }
  };

  const handleMessagePress = () => {
    if (isGuest) {
      showGuestPrompt("messages");
    } else {
      console.log("Message pressed");
    }
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Home"
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
      >
        <View style={styles.content}>
          <TodayOutfit />
          <YourFavorites />
          <TrendingCommunity />
          <QuickNavigation />
        </View>
      </ScrollView>

      {/* Guest Prompt Modal */}
      <GuestPrompt
        visible={guestPromptVisible}
        onClose={() => setGuestPromptVisible(false)}
        onLogin={handleLogin}
        feature={guestFeature}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
