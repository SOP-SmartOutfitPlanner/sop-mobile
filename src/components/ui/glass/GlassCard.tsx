import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { GlassSurface, GlassSurfaceProps } from "./GlassSurface";
import { glassTextColors } from "../../../theme/glassTokens";

export interface GlassCardProps extends Omit<GlassSurfaceProps, "children"> {
  title?: string;
  subtitle?: string;
  meta?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  meta,
  leading,
  actions,
  children,
  contentStyle,
  titleStyle,
  subtitleStyle,
  ...surfaceProps
}) => {
  return (
    <GlassSurface {...surfaceProps} contentStyle={[styles.body, contentStyle]}>
      <View style={styles.header}>
        <View style={styles.leading}>{leading}</View>
        <View style={styles.textWrapper}>
          {title ? (
            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
      {children ? <View style={styles.slot}>{children}</View> : null}
      {meta ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{meta}</Text>
        </View>
      ) : null}
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leading: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: glassTextColors.light,
  },
  subtitle: {
    fontSize: 14,
    color: glassTextColors.muted,
  },
  actions: {
    marginLeft: 8,
  },
  slot: {
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.6)",
  },
});

export default GlassCard;



