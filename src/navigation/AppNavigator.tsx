import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CommunityScreen from "../screens/CommunityScreen";
import { OnboardingScreen } from "../screens/onboarding";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { VerifyScreen } from "../screens/auth/VerifyScreen";
import { AuthNavigator } from "./AuthNavigator";

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
