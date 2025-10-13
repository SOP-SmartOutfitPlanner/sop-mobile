import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/common";
import {
  CollectionSearchBar,
  CollectionFilters,
  CollectionCard,
  CollectionHeader,
} from "../components/collection";

const CollectionScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState("Filters");

  // Mock data
  const collections = [
    {
      id: "1",
      title: "Business Casual Essentials",
      description: "Perfect outfits for the modern workplace",
      image: require("../../assets/adaptive-icon.png"),
      tags: ["Work", "Casual", "Smart"],
      author: "Sarah Chen",
      views: 1240,
      likes: 89,
      items: 156,
    },
    {
      id: "2",
      title: "Winter Elegance",
      description: "Sophisticated looks for cold weather",
      image: require("../../assets/adaptive-icon.png"),
      tags: ["Winter", "Elegant", "Formal"],
      author: "Maya Johnson",
      views: 890,
      likes: 67,
      items: 124,
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

  const handleCollectionPress = (id: string) => {
    Alert.alert("Collection", `Opening collection ${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Collections"
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
        <CollectionSearchBar />
        <CollectionFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <CollectionHeader count={collections.length} showTrending={true} />

        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            id={collection.id}
            title={collection.title}
            description={collection.description}
            image={collection.image}
            tags={collection.tags}
            author={collection.author}
            views={collection.views}
            likes={collection.likes}
            items={collection.items}
            onPress={() => handleCollectionPress(collection.id)}
          />
        ))}
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
});

export default CollectionScreen;
