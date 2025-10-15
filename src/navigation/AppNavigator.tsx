import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthNavigator } from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import { useAuth } from "../hooks/auth";
import ProfileScreen from "../screens/ProfileScreen";
import CommunityScreen from "../screens/CommunityScreen";
import { OnboardingScreen } from "../screens/onboarding";
import { VerifyScreen } from "../screens/VerifyScreen";
import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
  Community: undefined;
  Onboarding: undefined;
  Verify: { email: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  // const { isAuthenticated, isGuest } = useAuth();

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
    </Stack.Navigator>
  );
};
