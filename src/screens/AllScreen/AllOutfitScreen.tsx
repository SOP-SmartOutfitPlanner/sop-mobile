import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Header } from "../../components/common/Header";
import { AllOutfitsSection } from "../../components/outfit/AllOutfitsSection";
import { OutfitDetailModal } from "../../components/outfit/OutfitDetailModal";
import NotificationModal from "../../components/notification/NotificationModal";
import { useOutfits } from "../../hooks/outfit/useOutfits";
import { Outfit } from "../../types/outfit";

const AllOutfitScreen = ({ navigation }: any) => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const {
    outfits,
    metadata,
    loading,
    loadingMore,
    isRefreshing,
    handleRefresh,
    loadMoreOutfits,
    showError,
    toggleFavorite,
    deleteOutfit,
    visible,
    config,
    hideNotification,
  } = useOutfits();

  const transformedOutfits = useMemo(
    () =>
      outfits.map((outfit) => ({
        id: outfit.id.toString(),
        items: outfit.items.map((item) => item.imgUrl),
        name: outfit.name,
        favoriteCount: outfit.isFavorite ? 1 : 0,
        isFavorite: outfit.isFavorite,
        userDisplayName: outfit.userDisplayName,
        createdDate: outfit.createdDate,
        description: outfit.description,
        totalItems: outfit.items.length,
      })),
    [outfits]
  );

  const outfitPool = useMemo(() => {
    const mapping = new Map<number, Outfit>();
    outfits.forEach((item) => mapping.set(item.id, item));
    return mapping;
  }, [outfits]);

  const handleBack = () => {
    navigation?.goBack?.();
  };

  const handleNotificationPress = useCallback(() => {
    navigation.navigate("Notifications");
  }, [navigation]);

  const handleViewOutfit = (outfitId: string) => {
    const found = outfitPool.get(Number(outfitId));
    if (found) {
      setSelectedOutfit(found);
      setIsDetailVisible(true);
    } else {
      showError("Unable to find outfit details. Please try again.");
    }
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setSelectedOutfit(null);
  };

  const handleFavoriteToggle = async (outfitId: number) => {
    const success = await toggleFavorite(outfitId);
    if (success) {
      setSelectedOutfit((prev) =>
        prev && prev.id === outfitId ? { ...prev, isFavorite: !prev.isFavorite } : prev
      );
    }
  };

  const handleDeleteOutfit = async (outfitId: number) => {
    const success = await deleteOutfit(outfitId);
    if (success) {
      handleCloseDetail();
    }
  };

  const handleEditOutfit = (outfitId: number) => {
    showError("Edit outfit feature will be available soon.");
  };

  if (loading && outfits.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading outfits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="All Outfits"
        showBackButton
        onBackPress={handleBack}
        onNotificationPress={handleNotificationPress}
        onMessagePress={() => {}}
        onProfilePress={() => navigation.navigate("Profile")}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;

          if (
            isCloseToBottom &&
            metadata?.hasNext &&
            !loadingMore &&
            !loading &&
            loadMoreOutfits
          ) {
            loadMoreOutfits();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
      >
        <AllOutfitsSection
          outfits={transformedOutfits}
          title="All Outfits"
          emptyMessage="You have not created any outfits yet"
          onViewOutfit={handleViewOutfit}
          totalCount={metadata?.totalCount}
        />
        {metadata?.hasNext && !loadingMore && !loading && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={() => loadMoreOutfits()}
          >
            <Text style={styles.loadMoreButtonText}>Load more outfits</Text>
          </TouchableOpacity>
        )}
        {loadingMore && (
          <View style={styles.loadMoreContainer}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.loadMoreText}>Loading more outfits...</Text>
          </View>
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NotificationModal
        isVisible={visible}
        type={config.type}
        title={config.title}
        message={config.message}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        showCancel={config.showCancel}
        onConfirm={config.onConfirm}
        onClose={hideNotification}
      />

      <OutfitDetailModal
        visible={isDetailVisible}
        outfit={selectedOutfit}
        onClose={handleCloseDetail}
        onToggleFavorite={handleFavoriteToggle}
        onDeleteOutfit={handleDeleteOutfit}
        onEditOutfit={handleEditOutfit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  bottomSpacing: {
    height: 80,
  },
  loadMoreButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#e5edff",
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  loadMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: "#64748b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
});

export default AllOutfitScreen;

