import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthNavigator } from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import { useAuth } from "../hooks/auth";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
