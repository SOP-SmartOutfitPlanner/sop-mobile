import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CommunityScreen from "../screens/CommunityScreen";
import { OnboardingScreen } from "../screens/onboarding";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { VerifyScreen } from "../screens/auth/VerifyScreen";
import { AuthNavigator } from "./AuthNavigator";
import AllOutfitScreen from "../screens/AllScreen/AllOutfitScreen";
import SuggestionScreen from "../screens/SuggestionScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { CreateCollectionScreen } from "../screens/CreateCollectionScreen";
import CalendarScreen from "@/screens/CalendarScreen";
import { CollectionDetailScreen } from "@/screens/CollectionDetailScreen";
import { useAuth } from "../hooks/auth";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Community: undefined;
  Onboarding: undefined;
  Verify: { email: string };
  AllOutfit: undefined;
  Suggestion: undefined;
  Notifications: undefined;
  CreateCollection: undefined;
  EditCollection: { collectionId: number };
  CollectionDetail: { collectionId: number };
  Calendar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        // User is authenticated - show main app screens
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="AllWardrobe" component={AllWardrobeScreen} />
          <Stack.Screen name="AllOutfit" component={AllOutfitScreen} />
          <Stack.Screen name="Suggestion" component={SuggestionScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="EditCollection" component={CreateCollectionScreen} />
          <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
          <Stack.Screen name="CreateCollection" component={CreateCollectionScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
        </>
      ) : (
        // User is not authenticated - show auth screens
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
});
