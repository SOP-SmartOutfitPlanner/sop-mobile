/**
 * Collection UI Design Constants
 * Based on dark theme with glass morphism effects
 */

export const COLLECTION_COLORS = {
  background: {
    primary: "#0F172A", // Dark slate
    secondary: "#111827", // Dark gray
    gradient: ["#0F172A", "#1E1B4B"] as const, // Dark blue → Purple
  },
  glass: {
    card: "rgba(30, 41, 59, 0.6)", // Slate with opacity
    overlay: "rgba(15, 23, 42, 0.8)", // Dark overlay
    border: "rgba(148, 163, 184, 0.2)", // Light border
    light: "rgba(255, 255, 255, 0.1)", // Light glass
  },
  accent: {
    cyan: "#06B6D4", // Cyan for highlights
    blue: "#3B82F6", // Blue for active states
    purple: "#8B5CF6", // Purple for gradients
  },
  text: {
    primary: "#F1F5F9", // Almost white
    secondary: "#CBD5E1", // Light gray
    muted: "#94A3B8", // Medium gray
  },
  status: {
    published: "#10B981", // Green
    draft: "#F59E0B", // Amber
    saved: "#FCD34D", // Yellow
  },
};

export const COLLECTION_SPACING = {
  card: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
};

export const COLLECTION_TYPOGRAPHY = {
  hero: {
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: COLLECTION_COLORS.text.primary,
    },
    subtitle: {
      fontSize: 14,
      color: COLLECTION_COLORS.text.secondary,
    },
  },
  card: {
    title: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: COLLECTION_COLORS.text.primary,
    },
    description: {
      fontSize: 13,
      color: COLLECTION_COLORS.text.secondary,
    },
  },
};

