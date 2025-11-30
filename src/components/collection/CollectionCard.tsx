import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CollectionRecord } from "../../types/collection";
import { COLLECTION_COLORS } from "../../constants/collectionStyles";

const FALLBACK_IMAGE = require("../../../assets/adaptive-icon.png");

interface CollectionCardProps {
  collection: CollectionRecord;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onPress,
}) => {
  const navigation = useNavigation<any>();

  const handleAuthorPress = () => {
    if (collection.userId) {
      navigation.navigate("UserCollections", {
        userId: collection.userId,
        userName: collection.userDisplayName,
      });
    }
  };
  const coverSource: ImageSourcePropType = collection.thumbnailURL
    ? { uri: collection.thumbnailURL }
    : FALLBACK_IMAGE;

  const avatarSource =
    collection.avtUrl && collection.avtUrl.length > 0
      ? { uri: collection.avtUrl }
      : null;

  const outfitCount = collection.outfits?.length ?? 0;
  const itemCount = useMemo(
    () =>
      collection.outfits?.reduce(
        (total, entry) => total + (entry.outfit?.itemCount ?? 0),
        0
      ) ?? 0,
    [collection.outfits]
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={coverSource} style={styles.image} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />

      {/* Glass Morphism Content Panel */}
      <View style={styles.glassPanel}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.statusBadge,
              collection.isPublished
                ? styles.publishedBadge
                : styles.draftBadge,
            ]}
          >
            <Ionicons
              name={collection.isPublished ? "globe" : "lock-closed"}
              size={12}
              color={
                collection.isPublished
                  ? COLLECTION_COLORS.status.published
                  : COLLECTION_COLORS.status.draft
              }
            />
            <Text
              style={[
                styles.statusText,
                collection.isPublished
                  ? styles.publishedText
                  : styles.draftText,
              ]}
            >
              {collection.isPublished ? "Published" : "Draft"}
            </Text>
          </View>
          {collection.isSaved && (
            <View style={styles.savedBadge}>
              <Ionicons
                name="bookmark"
                size={12}
                color={COLLECTION_COLORS.status.saved}
              />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {collection.title}
          </Text>
          {collection.shortDescription && (
            <Text style={styles.description} numberOfLines={2}>
              {collection.shortDescription}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.authorContainer}
            onPress={handleAuthorPress}
            activeOpacity={0.7}
          >
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={18}
                color={COLLECTION_COLORS.text.secondary}
              />
            )}
            <Text style={styles.authorText} numberOfLines={1}>
              {collection.userDisplayName}
            </Text>
          </TouchableOpacity>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons
                name="heart-outline"
                size={14}
                color={COLLECTION_COLORS.text.secondary}
              />
              <Text style={styles.statText}>{collection.likeCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="bookmark-outline"
                size={14}
                color={COLLECTION_COLORS.text.secondary}
              />
              <Text style={styles.statText}>{collection.savedCount ?? 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="layers-outline"
                size={14}
                color={COLLECTION_COLORS.text.secondary}
              />
              <Text style={styles.statText}>
                {outfitCount} / {itemCount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLLECTION_COLORS.background.secondary,
    shadowColor: COLLECTION_COLORS.accent.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  glassPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLLECTION_COLORS.glass.overlay,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  publishedBadge: {
    backgroundColor: `${COLLECTION_COLORS.status.published}20`,
    borderColor: `${COLLECTION_COLORS.status.published}60`,
  },
  draftBadge: {
    backgroundColor: `${COLLECTION_COLORS.status.draft}20`,
    borderColor: `${COLLECTION_COLORS.status.draft}60`,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  publishedText: {
    color: COLLECTION_COLORS.status.published,
  },
  draftText: {
    color: COLLECTION_COLORS.status.draft,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${COLLECTION_COLORS.status.saved}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${COLLECTION_COLORS.status.saved}60`,
  },
  savedText: {
    fontSize: 11,
    color: COLLECTION_COLORS.status.saved,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLLECTION_COLORS.text.primary,
    marginBottom: 8,
    lineHeight: 26,
  },
  description: {
    fontSize: 13,
    color: COLLECTION_COLORS.text.secondary,
    fontWeight: "400",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
  },
  authorText: {
    fontSize: 13,
    color: COLLECTION_COLORS.text.secondary,
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: COLLECTION_COLORS.text.secondary,
    fontWeight: "600",
  },
});

export default CollectionCard;
