import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Header } from "../components/common";
import {
  TodayOutfit,
  WeeklyChallenge,
  YourFavorites,
  TrendingCommunity,
  QuickNavigation,
} from "../components/home";

export default function HomeScreen({ navigation }: any) {
  const handleNotificationPress = () => {
    console.log("Notification pressed");
  };

  const handleMessagePress = () => {
    console.log("Message pressed");
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
          <WeeklyChallenge />
          <YourFavorites />
          <TrendingCommunity />
          <QuickNavigation />
        </View>
      </ScrollView>
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
