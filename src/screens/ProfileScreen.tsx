import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../hooks/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ProfileHeader,
  GuestProfileSection,
  UserProfileSection,
  ProfileTabs,
  ProfileContent,
  LogoutButton,
  type ProfileTab,
  type OutfitItem,
} from "../components/profile";

const ProfileScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Outfits");
  const { user, isGuest, logout } = useAuth();

  const outfits: OutfitItem[] = [
    {
      id: "1",
      title: "Summer Casual",
      category: "Casual",
      tags: ["Casual", "Summer", "Sustainable"],
      image: require("../../assets/adaptive-icon.png"),
      status: "Winner",
    },
    {
      id: "2",
      title: "Office Chic",
      category: "Business",
      tags: ["Business", "Elegant", "Minimalist"],
      image: require("../../assets/adaptive-icon.png"),
      status: "Runner-up",
    },
    {
      id: "3",
      title: "Street Style",
      category: "Urban",
      tags: ["Urban", "Edgy", "Casual"],
      image: require("../../assets/adaptive-icon.png"),
    },
  ];

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Auth", { screen: "Login" });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader onBackPress={handleBackPress} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {isGuest ? (
          <GuestProfileSection onLoginPress={handleLogin} />
        ) : (
          <UserProfileSection user={user} />
        )}

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ProfileContent activeTab={activeTab} outfits={outfits} />

        {!isGuest && <LogoutButton onLogout={handleLogout} />}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
});

export default ProfileScreen;
