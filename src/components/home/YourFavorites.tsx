import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { FAVORITES_DATA } from "../../constants/homeData";
import {
  COLORS,
  SPACING,
  SHADOWS,
  SIZES,
  BASE_STYLES,
} from "../../constants/homeStyles";

interface FavoriteItemProps {
  item: (typeof FAVORITES_DATA)[0];
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item }) => (
  <TouchableOpacity style={styles.favoriteItem}>
    <Image source={{ uri: item.imageUri }} style={styles.favoriteImage} />
    <Text style={styles.favoriteTitle} numberOfLines={1}>
      {item.title}
    </Text>
    {item.label && (
      <Text style={styles.favoriteLabel} numberOfLines={1}>
        {item.label}
      </Text>
    )}
  </TouchableOpacity>
);

export const YourFavorites: React.FC = () => {
  return (
    <View style={[BASE_STYLES.cardBase, styles.container]}>
      <View style={styles.header}>
        <Text style={BASE_STYLES.titleBase}>Your Favorites</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesScroll}
      >
        {FAVORITES_DATA.map((item) => (
          <FavoriteItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  favoritesScroll: {
    paddingRight: SPACING.md,
  },
  favoriteItem: {
    marginRight: SPACING.md,
    width: 100,
  },
  favoriteImage: {
    width: 100,
    height: 120,
    borderRadius: SPACING.md,
    marginBottom: SPACING.sm,
  },
  favoriteTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  favoriteLabel: {
    fontSize: 10,
    color: COLORS.text.secondary,
  },
});
