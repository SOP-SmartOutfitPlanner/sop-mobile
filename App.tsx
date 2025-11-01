import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/hooks/auth";
import { useOTAUpdates } from "./src/hooks/useOTAUpdates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AIDetectionProvider } from "./src/contexts/AIDetectionContext";
import "./src/config/google";

export default function App() {
  // Initialize OTA updates check
  useOTAUpdates();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AIDetectionProvider>
            <NavigationContainer>
              <BottomSheetModalProvider>
                <StatusBar style="auto" />
                <AppNavigator />
              </BottomSheetModalProvider>
            </NavigationContainer>
          </AIDetectionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
