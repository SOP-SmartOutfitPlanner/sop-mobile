import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import CollectionScreen from "../screens/CollectionScreen";
import SuggestionScreen from "../screens/SuggestionScreen";
// import FavoriteScreen from "../screens/FavoriteScreen";
import CustomTabBar from "../components/common/CustomTabBar";
import { AIDetectionBanner } from "../components/loading/AIDetectionBanner";
import OutfitScreen from "../screens/OutfitScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
        <Tab.Screen name="Suggestion" component={SuggestionScreen} />
        <Tab.Screen name="Outfit" component={OutfitScreen} />
        <Tab.Screen name="Collection" component={CollectionScreen} />
      </Tab.Navigator>
      <AIDetectionBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomTabNavigator;
