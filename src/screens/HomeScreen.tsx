import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Header } from "../components/common";
import {
  TodayOutfit,
  WeeklyChallenge,
  YourFavorites,
  TrendingCommunity,
  QuickNavigation,
} from "../components/home";
import { useAuth } from "../hooks/auth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function HomeScreen({ navigation }: any) {
  const { isGuest } = useAuth();

  const showGuestAlert = (feature: string) => {
    Alert.alert(
      "Yêu cầu đăng nhập",
      `Bạn cần đăng nhập để sử dụng tính năng ${feature}`,
      [
        {
          text: "Để sau",
          style: "cancel",
        },
        {
          text: "Đăng nhập",
          onPress: () => navigation.navigate("Auth", { screen: "Login" }),
        },
      ]
    );
  };

  const handleNotificationPress = () => {
    if (isGuest) {
      showGuestAlert("thông báo");
    } else {
      console.log("Notification pressed");
    }
  };

  const handleMessagePress = () => {
    if (isGuest) {
      showGuestAlert("tin nhắn");
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
