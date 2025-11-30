import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Header } from "../components/common";
import { CollectionCard } from "../components/collection";
import { useUserCollections } from "../hooks/useCollections";
import { CollectionStackParamList } from "../navigation/CollectionStackNavigator";
import { useFocusEffect } from "@react-navigation/native";
import { COLLECTION_COLORS } from "../constants/collectionStyles";

type UserCollectionsRoute = RouteProp<CollectionStackParamList, "UserCollections">;

const UserCollectionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<UserCollectionsRoute>();
  const userId = route.params?.userId;
  const userName = route.params?.userName || "User";

  const { collections, loading, refreshing, error, count, handleRefresh } =
    useUserCollections(userId);

  const handleCollectionPress = (collectionId: number) => {
    navigation.navigate("CollectionDetail", { collectionId });
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const navigationHandlers = {
    onNotificationPress: () => navigation.navigate("Notifications"),
    onMessagePress: () => navigation.navigate("Suggestion"),
    onProfilePress: () => navigation.navigate("Profile"),
  };

  return (
    <LinearGradient
      colors={COLLECTION_COLORS.background.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Header
          title={`${userName}'s Collections`}
          showBackButton={true}
          showNotification={true}
          showMessage={true}
          showProfile={true}
          onNotificationPress={navigationHandlers.onNotificationPress}
          onMessagePress={navigationHandlers.onMessagePress}
          onProfilePress={navigationHandlers.onProfilePress}
        />

        <View style={styles.content}>
          {loading && !refreshing ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            <FlatList
              data={collections}
              keyExtractor={(item) => String(item.id)}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#2563EB"
                />
              }
              renderItem={({ item }) => (
                <CollectionCard
                  collection={item}
                  onPress={() => handleCollectionPress(item.id)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No collections yet</Text>
                  <Text style={styles.emptySubtitle}>
                    {error
                      ? error
                      : `${userName} hasn't published any collections yet.`}
                  </Text>
                </View>
              }
              contentContainerStyle={
                collections.length === 0 ? styles.flatListEmpty : undefined
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#030617",
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    marginTop: 48,
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
  },
  emptySubtitle: {
    textAlign: "center",
    color: COLLECTION_COLORS.text.muted,
  },
  flatListEmpty: {
    flexGrow: 1,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default UserCollectionsScreen;
