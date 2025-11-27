import React from "react";
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
} from "react-native";
import { GlassSurface, GlassSurfaceProps } from "./GlassSurface";
import { glassTextColors } from "../../../theme/glassTokens";

export type GlassButtonVariant = "primary" | "secondary" | "ghost";

export interface GlassButtonProps
  extends Omit<GlassSurfaceProps, "children" | "gradient" | "contentStyle"> {
  label: string;
  variant?: GlassButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

const variantMap: Record<
  GlassButtonVariant,
  { gradient: GlassSurfaceProps["gradient"]; textColor: string }
> = {
  primary: { gradient: "primary", textColor: glassTextColors.inverted },
  secondary: { gradient: "secondary", textColor: glassTextColors.light },
  ghost: { gradient: "accent", textColor: glassTextColors.inverted },
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  variant = "primary",
  icon,
  loading,
  leftAdornment,
  rightAdornment,
  textStyle,
  contentStyle,
  ...surfaceProps
}) => {
  const mapping = variantMap[variant];

  return (
    <GlassSurface
      {...surfaceProps}
      gradient={mapping.gradient}
      contentStyle={[styles.content, contentStyle]}
      accessibilityRole="button"
      highlight={variant !== "ghost"}
    >
      {leftAdornment}
      {loading ? (
        <ActivityIndicator color={mapping.textColor} />
      ) : icon ? (
        <View style={styles.icon}>{icon}</View>
      ) : null}
      <Text
        style={[
          styles.label,
          { color: mapping.textColor },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {rightAdornment}
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  content: {
    minHeight: 54,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlassButton;



