import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

// Design System Constants
export const COLORS = {
  primary: "#4f46e5",
  secondary: "#64748b",
  background: "#f8fafc",
  white: "#ffffff",
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    light: "#0f172a",
  },
  tags: {
    smart: "#22c55e",
    weather: "#3b82f6",
  },
  challenge: "#a855f7",
  favorite: "#f59e0b",
};

export const SHADOWS = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
};

export const SIZES = {
  navItemWidth: (width - 44) / 2,
  navItemHeight: 80,
  outfitImageSide: 80,
  outfitImageCenter: { width: 100, height: 120 },
  favoriteImageSize: { width: 80, height: 100 },
  postImageHeight: 200,
  userAvatarSize: 40,
  badgeSize: 24,
  actionButtonSize: 48,
};

// Base Styles
export const BASE_STYLES = StyleSheet.create({
  cardBase: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  headerBase: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  titleBase: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  buttonBase: {
    borderRadius: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
});