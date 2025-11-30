import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CommunityScreen from "../screens/CommunityScreen";
import { OnboardingScreen } from "../screens/onboarding";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { VerifyScreen } from "../screens/auth/VerifyScreen";
import { AuthNavigator } from "./AuthNavigator";
import AllWardrobeScreen from "../screens/AllScreen/AllWardrobeScreen";
import AllOutfitScreen from "../screens/AllScreen/AllOutfitScreen";
import SuggestionScreen from "../screens/SuggestionScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { CollectionDetailScreen } from "../screens/CollectionDetailScreen";
import { CreateCollectionScreen } from "../screens/CreateCollectionScreen";
import CalendarScreen from "@/screens/CalendarScreen";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
  Community: undefined;
  Onboarding: undefined;
  Verify: { email: string };
  AllWardrobe: undefined;
  AllOutfit: undefined;
  Suggestion: undefined;
  Notifications: undefined;
  CollectionDetail: { collectionId: number };
  CreateCollection: undefined;
  Calendar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="AllWardrobe" component={AllWardrobeScreen} />
      <Stack.Screen name="AllOutfit" component={AllOutfitScreen} />
      <Stack.Screen name="Suggestion" component={SuggestionScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
      <Stack.Screen name="CreateCollection" component={CreateCollectionScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
};
