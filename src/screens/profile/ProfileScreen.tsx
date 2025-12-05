import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ProfileHeader,
  GuestProfileSection,
  UserProfileSection,
  LogoutButton,
} from "../../components/profile";
import { useAuth } from "../../hooks/auth";
import AnimatedBackground from "../../components/common/AnimatedBackground";

const ProfileScreen = ({ navigation }: any) => {
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

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleShareProfile = () => {
    // TODO: implement deep link share
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground>
        <ProfileHeader onBackPress={handleBackPress} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#38BDF8"
              colors={["#38BDF8"]}
            />
          }
        >
          {isGuest ? (
            <GuestProfileSection onLoginPress={handleLogin} />
          ) : (
            <View style={styles.heroCardWrapper}>
              <UserProfileSection
                user={user}
                onEditProfile={handleEditProfile}
                onShareProfile={handleShareProfile}
              />
            </View>
          )}

          {!isGuest && (
            <LogoutButton onLogout={handleLogout} disabled={isLoggingOut} />
          )}
        </ScrollView>
      </AnimatedBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCardWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    backgroundColor: "rgba(15,23,42,0.85)",
  },
});

export default ProfileScreen;
