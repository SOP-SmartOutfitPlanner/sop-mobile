import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
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
} from "../../components/profile";
import { useAuth } from "../../hooks/auth";

const ProfileScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Outfits");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, isGuest, logout, loadUserProfile } = useAuth();

  // Load user profile when screen is focused
  useEffect(() => {
    if (!isGuest) {
      loadUserProfile();
    }
  }, [isGuest]);

  // Pull to refresh handler
  const onRefresh = async () => {
    if (!isGuest) {
      setIsRefreshing(true);
      try {
        await loadUserProfile();
      } catch (error) {
        console.error("Error refreshing profile:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const outfits: OutfitItem[] = [
    
  ];

  const handleLogout = () => {
    try {
      setIsLoggingOut(true);
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
            colors={["#4F46E5"]}
          />
        }
      >
        {isGuest ? (
          <GuestProfileSection onLoginPress={handleLogin} />
        ) : (
          <UserProfileSection user={user} />
        )}

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ProfileContent activeTab={activeTab} outfits={outfits} />

        {!isGuest && (
          <LogoutButton onLogout={handleLogout} disabled={isLoggingOut} />
        )}
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
