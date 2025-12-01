import React, { useMemo } from "react";
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
import { Header } from "../components/common";
import {
  CollectionSearchBar,
  CollectionCard,
  CollectionHeader,
  CollectionTabs,
} from "../components/collection";
import { useCollectionsGallery, CollectionTab } from "../hooks/useCollections";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLLECTION_COLORS } from "../constants/collectionStyles";
import { useCallback } from "react";

const TAB_LABELS: Record<CollectionTab, string> = {
  all: "All collections",
  saved: "Saved collections",
  published: "Published collections",
  drafts: "Draft collections",
};

const CollectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    collections,
    loading,
    refreshing,
    error,
    count,
    requiresAuthMessage,
    handleRefresh,
    isStylist,
    isAuthenticated,
  } = useCollectionsGallery();

  const tabConfig = useMemo(
    () => [
      { key: "all" as CollectionTab, label: "All" },
      {
        key: "saved" as CollectionTab,
        label: "Saved",
        disabled: !isAuthenticated,
      },
      {
        key: "published" as CollectionTab,
        label: "Published",
        disabled: !isStylist,
      },
      {
        key: "drafts" as CollectionTab,
        label: "Drafts",
        disabled: !isStylist,
      },
    ],
    [isAuthenticated, isStylist]
  );

  const navigationHandlers = {
    onNotificationPress: () => navigation.navigate("Notifications"),
    onMessagePress: () => navigation.navigate("Suggestion"), // placeholder
    onProfilePress: () => navigation.navigate("Profile"),
  };

  const handleCollectionPress = (collectionId: number) => {
    navigation.navigate("CollectionDetail", { collectionId });
  };

  // Refresh when screen comes into focus (e.g., after deleting a collection)
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  return (
    <LinearGradient
      colors={["#1e3a8a", "#172554"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Header
          title="Collections"
          showBackButton={false}
          showNotification={true}
          showMessage={true}
          showProfile={true}
          onNotificationPress={navigationHandlers.onNotificationPress}
          onMessagePress={navigationHandlers.onMessagePress}
          onProfilePress={navigationHandlers.onProfilePress}
        />

        <View style={styles.content}>
          <CollectionSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <CollectionTabs
            tabs={tabConfig}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <View style={styles.headerRow}>
            <CollectionHeader
              count={count}
              label={TAB_LABELS[activeTab]}
              showTrending={activeTab === "all"}
            />
            {isStylist && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateCollection")}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={24} color="#2563EB" />
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            )}
          </View>

          {requiresAuthMessage ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{requiresAuthMessage}</Text>
            </View>
          ) : loading && !refreshing ? (
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
                      : "Try a different tab or come back later for fresh inspiration."}
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
  bottomSpacing: {
    height: 80, // pb-32 equivalent (32 * 4 = 128px)
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
  messageCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.accent.cyan}40`,
    backgroundColor: COLLECTION_COLORS.glass.card,
  },
  messageText: {
    color: COLLECTION_COLORS.accent.cyan,
    fontWeight: "500",
    textAlign: "center",
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLLECTION_COLORS.glass.light,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.accent.cyan}40`,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLLECTION_COLORS.accent.cyan,
  },
});

export default CollectionScreen;
