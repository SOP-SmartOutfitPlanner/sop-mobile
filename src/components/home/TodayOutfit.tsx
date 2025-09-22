import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Heart, Share } from "lucide-react-native";
import { OUTFIT_DATA } from "../../constants/homeData";
import {
  COLORS,
  SPACING,
  SHADOWS,
  SIZES,
  BASE_STYLES,
} from "../../constants/homeStyles";

interface OutfitItemProps {
  item: (typeof OUTFIT_DATA.items)[0];
  index: number;
}

const OutfitItem: React.FC<OutfitItemProps> = ({ item, index }) => {
  const isCenter = item.isCenter;
  return (
    <View
      style={isCenter ? styles.centerOutfitWrapper : styles.outfitItemWrapper}
    >
      <View style={styles.outfitNumberBadge}>
        <Text style={styles.outfitNumberText}>{index + 1}</Text>
      </View>
      <Image
        source={{ uri: item.imageUri }}
        style={isCenter ? styles.centerOutfitImage : styles.sideOutfitImage}
      />
      {!isCenter && <Text style={styles.outfitItemName}>{item.name}</Text>}
    </View>
  );
};

interface OutfitTagProps {
  tag: (typeof OUTFIT_DATA.tags)[0];
}

const OutfitTag: React.FC<OutfitTagProps> = ({ tag }) => (
  <View style={tag.style === "smart" ? styles.tagSmart : styles.tagWeather}>
    <Text style={styles.tagText}>{tag.text}</Text>
  </View>
);

export const TodayOutfit: React.FC = () => {
  return (
    <View style={[BASE_STYLES.cardBase, styles.container]}>
      <View style={styles.header}>
        <Text style={BASE_STYLES.titleBase}>Today's Outfit</Text>
      </View>

      <View style={styles.matchScoreContainer}>
        <Text style={styles.matchScore}>{OUTFIT_DATA.matchScore}</Text>
        <Text style={styles.weatherDescription}>
          {OUTFIT_DATA.weatherDescription}
        </Text>
      </View>

      <View style={styles.outfitItemsContainer}>
        {OUTFIT_DATA.items.map((item, index) => (
          <OutfitItem key={item.id} item={item} index={index} />
        ))}
      </View>

      <View style={styles.outfitTags}>
        {OUTFIT_DATA.tags.map((tag, index) => (
          <OutfitTag key={index} tag={tag} />
        ))}
      </View>

      <View style={styles.outfitActions}>
        <TouchableOpacity style={styles.useTodayButton}>
          <Text style={styles.useTodayText}>Use Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={18} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  matchScoreContainer: {
    marginBottom: SPACING.xl,
  },
  matchScore: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.light,
    marginBottom: SPACING.xs,
  },
  weatherDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  outfitItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingHorizontal: 10,
  },
  outfitItemWrapper: {
    alignItems: "center",
    flex: 1,
  },
  centerOutfitWrapper: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  outfitNumberBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: SIZES.badgeSize,
    height: SIZES.badgeSize,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.badgeSize / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  outfitNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  sideOutfitImage: {
    width: SIZES.outfitImageSide,
    height: SIZES.outfitImageSide,
    borderRadius: SPACING.md,
    marginBottom: SPACING.sm,
  },
  centerOutfitImage: {
    width: SIZES.outfitImageCenter.width,
    height: SIZES.outfitImageCenter.height,
    borderRadius: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  outfitItemName: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: "center",
    maxWidth: 80,
  },
  outfitTags: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  tagSmart: {
    backgroundColor: COLORS.tags.smart,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagWeather: {
    backgroundColor: COLORS.tags.weather,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "500",
  },
  outfitActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  useTodayButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  useTodayText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    width: SIZES.actionButtonSize,
    height: SIZES.actionButtonSize,
    backgroundColor: "#f1f5f9",
    borderRadius: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: SIZES.actionButtonSize,
    height: SIZES.actionButtonSize,
    backgroundColor: "#f1f5f9",
    borderRadius: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
