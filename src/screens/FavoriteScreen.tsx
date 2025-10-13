import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/common";
import {
  FavoriteSearchBar,
  FavoriteTabs,
  OutfitCard,
  OutfitFavoritesSection,
} from "../components/favorite";

const FavoriteScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<"Outfits" | "Items">("Outfits");

  // Mock data
  const favoriteOutfits = [
    {
      id: "1",
      title: "Smart Casual Meeting",
      image: require("../../assets/adaptive-icon.png"),
      tags: ["smart", "casual", "work"],
      isFavorite: true,
    },
    {
      id: "2",
      title: "Weekend Brunch",
      image: require("../../assets/adaptive-icon.png"),
      tags: ["casual", "weekend", "comfortable"],
      isFavorite: true,
    },
  ];

  // Handlers
  const handleNotificationPress = () => {
    Alert.alert("Notifications", "You have new notifications");
  };

  const handleMessagePress = () => {
    Alert.alert("Messages", "No new messages");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleFavoritePress = (id: string) => {
    Alert.alert("Favorite", `Toggle favorite for outfit ${id}`);
  };

  const handleMenuPress = (id: string) => {
    Alert.alert("Menu", `Show menu for outfit ${id}`);
  };

  const handleUseTodayPress = (id: string, title: string) => {
    Alert.alert("Use Today", `Using "${title}" for today's outfit!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Favorites"
        showBackButton={false}
        showNotification={true}
        showMessage={true}
        showProfile={true}
        onNotificationPress={handleNotificationPress}
        onMessagePress={handleMessagePress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <FavoriteSearchBar />
        <FavoriteTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Outfits" && (
          <>
            <OutfitFavoritesSection />
            {favoriteOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                id={outfit.id}
                title={outfit.title}
                image={outfit.image}
                tags={outfit.tags}
                isFavorite={outfit.isFavorite}
                onPressFavorite={() => handleFavoritePress(outfit.id)}
                onPressMenu={() => handleMenuPress(outfit.id)}
                onPressUseToday={() =>
                  handleUseTodayPress(outfit.id, outfit.title)
                }
              />
            ))}
          </>
        )}

        {activeTab === "Items" && (
          <View style={styles.emptyState}>{/* TODO: Add Items view */}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    padding: 20,
  },
});

export default FavoriteScreen;
