import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ViewProps,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  glassDefaults,
  glassGradients,
  glassShadow,
  glassBorder,
  glassRipples,
  GlassGradientName,
  GlassTint,
} from "../../../theme/glassTokens";

export interface GlassSurfaceProps extends Omit<ViewProps, "style"> {
  children: React.ReactNode;
  gradient?: GlassGradientName;
  tint?: GlassTint;
  intensity?: number;
  borderRadius?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  elevated?: boolean;
  highlight?: boolean;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  gradient = "primary",
  tint = glassDefaults.tint,
  intensity = glassDefaults.intensity,
  borderRadius = glassDefaults.borderRadius,
  onPress,
  disabled,
  style,
  contentStyle,
  elevated = true,
  highlight = true,
  ...rest
}) => {
  const colors = glassGradients[gradient];

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={!onPress || disabled}
      style={({ pressed }) => [
        styles.base,
        elevated && glassShadow.light,
        { borderRadius },
        style,
        pressed && onPress ? styles.pressed : null,
        disabled && styles.disabled,
      ]}
      android_ripple={glassRippleConfig}
    >
      <BlurView
        tint={tint}
        intensity={intensity}
        style={[StyleSheet.absoluteFill, styles.blur, { borderRadius }]}
      />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.gradient, { borderRadius }]}
      />
      {highlight && (
        <LinearGradient
          colors={["rgba(255,255,255,0.55)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          style={[
            styles.highlight,
            { borderRadius, borderColor: glassBorder.strong },
          ]}
        />
      )}
      <View pointerEvents="box-none" style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glassBorder.default,
    backgroundColor: "rgba(15,23,42,0.2)",
  },
  blur: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
  },
  gradient: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.12)",
  },
  highlight: {
    opacity: 0.35,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    padding: 18,
  },
});

export const glassRippleConfig = {
  color: glassRipples.light,
  borderless: false,
};

export default GlassSurface;

