import { Platform } from "react-native";

export type GlassGradientName = "primary" | "secondary" | "accent" | "warning";
export type GlassTint = "default" | "light" | "dark";

export const glassGradients: Record<GlassGradientName, [string, string]> = {
  primary: ["rgba(59,130,246,0.35)", "rgba(147,197,253,0.15)"],
  secondary: ["rgba(14,165,233,0.35)", "rgba(125,211,252,0.15)"],
  accent: ["rgba(236,72,153,0.45)", "rgba(245,208,254,0.2)"],
  warning: ["rgba(251,191,36,0.45)", "rgba(253,230,138,0.2)"],
};

export const glassBorder = {
  default: "rgba(255,255,255,0.25)",
  strong: "rgba(255,255,255,0.45)",
};

export const glassShadow = {
  light: {
    shadowColor: "rgba(15,23,42,0.35)",
    shadowOpacity: Platform.OS === "ios" ? 0.4 : 1,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 38,
    elevation: 24,
  },
};

export const glassDefaults = {
  borderRadius: 24,
  tint: "default" as GlassTint,
  intensity: 60,
};

export const glassRipples = {
  light: "rgba(255,255,255,0.12)",
  dark: "rgba(148,163,184,0.24)",
};

export const glassTextColors = {
  light: "#0F172A",
  muted: "rgba(71,85,105,0.85)",
  inverted: "#F8FAFC",
};



