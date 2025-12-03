import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { CollectionStackParamList } from "../navigation/CollectionStackNavigator";
import { useCollectionDetail } from "../hooks/useCollections";
import { CollectionItemDetail } from "../types/collection";
import { CollectionComments } from "../components/collection";
import { COLLECTION_COLORS } from "../constants/collectionStyles";

type CollectionDetailRoute = RouteProp<
  CollectionStackParamList,
  "CollectionDetail"
>;

const FALLBACK_IMAGE = require("../../assets/adaptive-icon.png");

type CollectionDetailNavigation = StackNavigationProp<
  CollectionStackParamList,
  "CollectionDetail"
>;

export const CollectionDetailScreen: React.FC = () => {
  const navigation = useNavigation<CollectionDetailNavigation>();
  const route = useRoute<CollectionDetailRoute>();
  const collectionId = route.params?.collectionId;

  const {
    collection,
    loading,
    error,
    toggleLike,
    toggleSave,
    toggleFollow,
    togglePublish,
    deleteCollection,
    refetch,
    isOwner,
    setCommentCount,
  } = useCollectionDetail(collectionId);
  const [expandedOutfitId, setExpandedOutfitId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectionItemDetail | null>(
    null
  );

  const coverSource = collection?.thumbnailURL
    ? { uri: collection.thumbnailURL }
    : FALLBACK_IMAGE;

  const weatherTags = useMemo(() => {
    if (!collection?.outfits?.length) {
      return [];
    }
    const tagSet = new Set<string>();
    collection.outfits.forEach((entry) => {
      entry.outfit?.items?.forEach((item) => {
        if (item.weatherSuitable) {
          tagSet.add(item.weatherSuitable);
        }
      });
    });
    return Array.from(tagSet).slice(0, 4);
  }, [collection?.outfits]);

  const renderItems = (items: CollectionItemDetail[]) => {
    return (
      <View style={styles.itemGrid}>
        {items.map((item) => {
          let primaryColor: string | null = null;
          if (item.color) {
            try {
              const parsed = JSON.parse(item.color) as
                | { name?: string }[]
                | undefined;
              if (Array.isArray(parsed) && parsed[0]?.name) {
                primaryColor = parsed[0].name ?? null;
              }
            } catch {
              primaryColor = item.color;
            }
          }

          const metaLabel = [
            item.categoryName,
            primaryColor ?? undefined,
          ].filter(Boolean).join(" · ");

          const imageSource =
            item.imgUrl && item.imgUrl.length > 0
              ? { uri: item.imgUrl }
              : FALLBACK_IMAGE;

          return (
            <TouchableOpacity
              key={item.itemId}
              style={styles.itemCard}
              activeOpacity={0.85}
              onPress={() => setSelectedItem(item)}
            >
              <Image source={imageSource} style={styles.itemImage} />
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                {!!metaLabel && (
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {metaLabel}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading && !collection) {
    return (
      <LinearGradient
        colors={COLLECTION_COLORS.background.gradient}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={COLLECTION_COLORS.accent.cyan}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !collection) {
    return (
      <LinearGradient
        colors={COLLECTION_COLORS.background.gradient}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>
            {error ?? "Collection not found."}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={COLLECTION_COLORS.background.gradient}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        >
          <View style={styles.coverWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={COLLECTION_COLORS.text.primary}
              />
            </TouchableOpacity>
            <Image source={coverSource} style={styles.coverImage} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
              locations={[0, 0.6, 1]}
              style={styles.coverOverlay}
            >
              <Text style={styles.collectionTitle}>{collection.title}</Text>
              {collection.shortDescription && (
                <Text style={styles.collectionDescription}>
                  {collection.shortDescription}
                </Text>
              )}
              {isOwner && (
                <TouchableOpacity
                  style={styles.coverEditButton}
                  onPress={() =>
                    navigation.navigate("EditCollection", {
                      collectionId: collection.id,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={COLLECTION_COLORS.text.primary}
                  />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>

          <View style={styles.glassSection}>
            <View style={styles.authorRow}>
              <TouchableOpacity
                style={styles.authorInfoContainer}
                onPress={() => {
                  if (collection.userId) {
                    navigation.navigate("UserCollections", {
                      userId: collection.userId,
                      userName: collection.userDisplayName,
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                {collection.avtUrl && collection.avtUrl.length > 0 ? (
                  <Image
                    source={{ uri: collection.avtUrl }}
                    style={styles.authorAvatar}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={32}
                    color={COLLECTION_COLORS.text.secondary}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>
                    {collection.userDisplayName}
                  </Text>
                  <Text style={styles.metaText}>
                    Updated{" "}
                    {new Date(
                      collection.updatedDate ?? collection.createdDate
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
              {!isOwner && (
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    collection.isFollowing && styles.followingButton,
                  ]}
                  onPress={toggleFollow}
                  activeOpacity={0.9}
                >
                  <Ionicons
                    name={collection.isFollowing ? "checkmark" : "add"}
                    size={16}
                    color={
                      collection.isFollowing
                        ? COLLECTION_COLORS.text.secondary
                        : COLLECTION_COLORS.text.primary
                    }
                  />
                  <Text
                    style={[
                      styles.followText,
                      collection.isFollowing && styles.followingText,
                    ]}
                  >
                    {collection.isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {weatherTags.length > 0 && (
              <View style={styles.tagRow}>
                {weatherTags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  collection.isLiked && styles.actionButtonActive,
                ]}
                onPress={toggleLike}
              >
                <Ionicons
                  name={collection.isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={
                    collection.isLiked
                      ? COLLECTION_COLORS.text.primary
                      : COLLECTION_COLORS.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    collection.isLiked && styles.actionTextActive,
                  ]}
                >
                  {collection.likeCount} Likes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  collection.isSaved && styles.actionButtonActive,
                ]}
                onPress={toggleSave}
              >
                <Ionicons
                  name={collection.isSaved ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={
                    collection.isSaved
                      ? COLLECTION_COLORS.text.primary
                      : COLLECTION_COLORS.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    collection.isSaved && styles.actionTextActive,
                  ]}
                >
                  {collection.savedCount ?? 0} Saved
                </Text>
              </TouchableOpacity>
            </View>

            {/* Owner Actions */}
            {isOwner && (
              <View style={styles.ownerActions}>
                <TouchableOpacity
                  style={[styles.ownerButton, styles.ownerButtonEdit]}
                  onPress={() =>
                    navigation.navigate("EditCollection", {
                      collectionId: collection.id,
                    })
                  }
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={COLLECTION_COLORS.accent.cyan}
                  />
                  <Text
                    style={[styles.ownerButtonText, styles.ownerButtonTextEdit]}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.ownerButton,
                    collection.isPublished && styles.ownerButtonPublished,
                  ]}
                  onPress={togglePublish}
                >
                  <Ionicons
                    name={collection.isPublished ? "globe" : "lock-closed"}
                    size={18}
                    color={
                      collection.isPublished
                        ? COLLECTION_COLORS.status.published
                        : COLLECTION_COLORS.status.draft
                    }
                  />
                  <Text
                    style={[
                      styles.ownerButtonText,
                      collection.isPublished && styles.ownerButtonTextPublished,
                    ]}
                  >
                    {collection.isPublished ? "Published" : "Draft"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ownerButton, styles.ownerButtonDelete]}
                  onPress={() => deleteCollection(() => navigation.goBack())}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text
                    style={[
                      styles.ownerButtonText,
                      styles.ownerButtonTextDelete,
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.glassSection}>
            <View style={styles.outfitsHeaderRow}>
              <Text style={styles.sectionTitle}>Outfits in this collection</Text>
              {collection.outfits.length > 1 && (
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.viewAllLink}>View all</Text>
                </TouchableOpacity>
              )}
            </View>
            {collection.outfits.length === 0 ? (
              <Text style={styles.metaText}>
                No outfits have been added yet.
              </Text>
            ) : (
              collection.outfits.map((entry, index) => (
                <View
                  key={`${entry.outfit.outfitId}-${index}`}
                  style={styles.outfitCard}
                >
                  <View style={styles.outfitHeader}>
                    <Text style={styles.outfitTitle}>{entry.outfit.name}</Text>
                    <Text style={styles.metaText}>
                      {entry.outfit.itemCount} items
                    </Text>
                  </View>
                  {entry.description && (
                    <>
                      <Text
                        style={styles.outfitDescription}
                        numberOfLines={
                          expandedOutfitId === entry.outfit.outfitId ? undefined : 3
                        }
                      >
                        {entry.description}
                      </Text>
                      {entry.description.length > 140 && (
                        <TouchableOpacity
                          onPress={() =>
                            setExpandedOutfitId(
                              expandedOutfitId === entry.outfit.outfitId
                                ? null
                                : entry.outfit.outfitId
                            )
                          }
                          activeOpacity={0.7}
                        >
                          <Text style={styles.readMoreText}>
                            {expandedOutfitId === entry.outfit.outfitId
                              ? "Show less"
                              : "Read more"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                  {renderItems(entry.outfit.items ?? [])}
                </View>
              ))
            )}
          </View>

          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>
              Comments ({collection.commentCount ?? 0})
            </Text>
            <CollectionComments
              collectionId={collection.id}
              initialCount={collection.commentCount ?? 0}
              onCountChange={setCommentCount}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomSpacing} />

        {selectedItem && (
          <Modal
            visible={!!selectedItem}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedItem(null)}
          >
            <View style={styles.itemModalBackdrop}>
              <View style={styles.itemModalCard}>
                <Image
                  source={
                    selectedItem.imgUrl && selectedItem.imgUrl.length > 0
                      ? { uri: selectedItem.imgUrl }
                      : FALLBACK_IMAGE
                  }
                  style={styles.itemModalImage}
                />
                <Text style={styles.itemModalTitle}>{selectedItem.name}</Text>
                <Text style={styles.itemModalMeta}>
                  {selectedItem.categoryName}
                  {selectedItem.weatherSuitable
                    ? ` · ${selectedItem.weatherSuitable}`
                    : ""}
                  {selectedItem.condition ? ` · ${selectedItem.condition}` : ""}
                </Text>
                {selectedItem.aiDescription && (
                  <Text style={styles.itemModalDescription}>
                    {selectedItem.aiDescription}
                  </Text>
                )}
                <View style={styles.itemModalTagsRow}>
                  {selectedItem.styles?.[0]?.name && (
                    <View style={styles.itemModalTagPill}>
                      <Text style={styles.itemModalTagText}>
                        {selectedItem.styles[0].name}
                      </Text>
                    </View>
                  )}
                  {selectedItem.occasions?.[0]?.name && (
                    <View style={styles.itemModalTagPill}>
                      <Text style={styles.itemModalTagText}>
                        {selectedItem.occasions[0].name}
                      </Text>
                    </View>
                  )}
                  {selectedItem.seasons?.[0]?.name && (
                    <View style={styles.itemModalTagPill}>
                      <Text style={styles.itemModalTagText}>
                        {selectedItem.seasons[0].name}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.itemModalCloseButton}
                  onPress={() => setSelectedItem(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.itemModalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
    backgroundColor: "transparent",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 24,
    gap: 16,
  },
  errorText: {
    textAlign: "center",
    color: COLLECTION_COLORS.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLLECTION_COLORS.accent.cyan,
  },
  retryText: {
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "600",
  },
  coverWrapper: {
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    justifyContent: "flex-end",
  },
  coverEditButton: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.6)",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderRadius: 999,
    padding: 10,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  collectionTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    marginBottom: 8,
    lineHeight: 38,
  },
  collectionDescription: {
    color: COLLECTION_COLORS.text.secondary,
    fontSize: 15,
    lineHeight: 20,
  },
  glassSection: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  authorName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
  },
  metaText: {
    fontSize: 13,
    color: COLLECTION_COLORS.text.muted,
    marginTop: 2,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLLECTION_COLORS.accent.cyan,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  followText: {
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  followingButton: {
    backgroundColor: COLLECTION_COLORS.glass.light,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  followingText: {
    color: COLLECTION_COLORS.text.secondary,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: `${COLLECTION_COLORS.accent.cyan}20`,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.accent.cyan}40`,
  },
  tagPillText: {
    fontSize: 12,
    color: COLLECTION_COLORS.accent.cyan,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    backgroundColor: COLLECTION_COLORS.glass.light,
  },
  actionButtonActive: {
    backgroundColor: COLLECTION_COLORS.accent.blue,
    borderColor: COLLECTION_COLORS.accent.blue,
  },
  actionText: {
    color: COLLECTION_COLORS.text.secondary,
    fontWeight: "600",
    fontSize: 14,
  },
  actionTextActive: {
    color: COLLECTION_COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    marginBottom: 16,
  },
  outfitsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: "600",
    color: COLLECTION_COLORS.accent.blue,
  },
  outfitCard: {
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: COLLECTION_COLORS.glass.light,
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  outfitTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    flex: 1,
    marginRight: 8,
  },
  outfitDescription: {
    color: COLLECTION_COLORS.text.secondary,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLLECTION_COLORS.accent.blue,
    marginBottom: 16,
  },
  itemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemCard: {
    flexBasis: "48%",
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: COLLECTION_COLORS.glass.card,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: "600",
    color: COLLECTION_COLORS.text.primary,
    fontSize: 13,
  },
  itemMeta: {
    fontSize: 11,
    color: COLLECTION_COLORS.text.secondary,
    marginTop: 2,
  },
  itemMetaSecondary: {
    fontSize: 11,
    color: COLLECTION_COLORS.text.muted,
    marginTop: 2,
  },
  itemModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  itemModalCard: {
    width: "100%",
    borderRadius: 24,
    padding: 20,
    backgroundColor: COLLECTION_COLORS.glass.card,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  itemModalImage: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 16,
  },
  itemModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    marginBottom: 4,
  },
  itemModalMeta: {
    fontSize: 13,
    color: COLLECTION_COLORS.text.muted,
    marginBottom: 12,
  },
  itemModalDescription: {
    fontSize: 14,
    color: COLLECTION_COLORS.text.secondary,
    marginBottom: 16,
  },
  itemModalTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  itemModalTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: `${COLLECTION_COLORS.accent.cyan}20`,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.accent.cyan}40`,
  },
  itemModalTagText: {
    fontSize: 12,
    color: COLLECTION_COLORS.accent.cyan,
    fontWeight: "600",
  },
  itemModalCloseButton: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLLECTION_COLORS.accent.cyan,
  },
  itemModalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLLECTION_COLORS.text.primary,
  },
  ownerActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLLECTION_COLORS.glass.border,
  },
  ownerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    backgroundColor: COLLECTION_COLORS.glass.light,
  },
  ownerButtonPublished: {
    flex: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "center",
    borderRadius: 999,
    borderColor: `${COLLECTION_COLORS.status.published}40`,
    backgroundColor: `${COLLECTION_COLORS.status.published}15`,
  },
  ownerButtonEdit: {
    borderColor: `${COLLECTION_COLORS.accent.cyan}60`,
    backgroundColor: `${COLLECTION_COLORS.accent.cyan}20`,
  },
  ownerButtonDelete: {
    borderColor: "#EF444430",
    backgroundColor: "transparent",
  },
  ownerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLLECTION_COLORS.text.secondary,
  },
  ownerButtonTextEdit: {
    color: COLLECTION_COLORS.accent.cyan,
  },
  ownerButtonTextPublished: {
    color: COLLECTION_COLORS.status.published,
  },
  ownerButtonTextDelete: {
    color: "#EF4444",
  },
});
