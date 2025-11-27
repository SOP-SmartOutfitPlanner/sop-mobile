import React, { useMemo, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
  ImageSourcePropType,
  Animated,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";

import { Info, X } from "lucide-react-native";
import { chooseDefaultIcon } from "react-native-notificated/lib/commonjs/defaultConfig/choseDefaultIcon";
import { chooseDefaultAccentColor } from "react-native-notificated/lib/commonjs/defaultConfig/stylesUtils";
import { themeBase } from "react-native-notificated/lib/commonjs/defaultConfig/components/theme";
import { LinearGradient } from "expo-linear-gradient";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationModalProps {
  isVisible: boolean;
  type?: NotificationType;
  title?: string;
  subtitle?: string;
  message: string;
  timestamp?: string;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  autoDismissMs?: number;
  onAutoDismiss?: () => void;
  maxContentHeight?: number;
}

type NotificatedTheme = "regular" | "dark";

const TYPE_LABELS: Record<NotificationType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

const hexToRgba = (hex?: string, alpha = 1) => {
  if (!hex) {
    return undefined;
  }

  const sanitizedHex = hex.replace("#", "");
  const parsed = Number.parseInt(sanitizedHex, 16);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isVisible,
  type = "info",
  title,
  subtitle,
  message,
  timestamp,
  onClose,
  confirmText = "OK",
  cancelText = "Hủy",
  onConfirm,
  showCancel = false,
  autoDismissMs,
  onAutoDismiss,
  maxContentHeight = 180,
}) => {
  const colorScheme = useColorScheme();
  const themeMode: NotificatedTheme =
    colorScheme === "dark" ? "dark" : "regular";
  const autoDismissDuration = autoDismissMs ?? 0;
  const progress = useRef(new Animated.Value(0)).current;
  const showProgressBar = autoDismissDuration >= 1500;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleAutoDismiss = useCallback(() => {
    onAutoDismiss?.();
    onClose();
  }, [onAutoDismiss, onClose]);

  useEffect(() => {
    if (isVisible && showProgressBar) {
      progress.setValue(0);
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: autoDismissDuration,
        useNativeDriver: false,
      });

      animation.start(({ finished }) => {
        if (finished) {
          handleAutoDismiss();
        }
      });

      return () => {
        animation.stop();
      };
    }
  }, [autoDismissMs, handleAutoDismiss, isVisible, progress, showProgressBar]);

  useEffect(() => {
    if (isVisible && autoDismissDuration && !showProgressBar) {
      const timer = setTimeout(() => {
        handleAutoDismiss();
      }, autoDismissDuration);

      return () => clearTimeout(timer);
    }
  }, [autoDismissDuration, handleAutoDismiss, isVisible, showProgressBar]);

  const typeProps = useMemo(() => {
    const accent =
      chooseDefaultAccentColor(type) ?? themeBase.color.info ?? "#3B82F6";
    const iconSource = chooseDefaultIcon(type, themeMode === "dark", "color");

    return {
      accent,
      iconSource: iconSource as ImageSourcePropType | undefined,
      iconBg:
        hexToRgba(accent, themeMode === "dark" ? 0.35 : 0.15) ??
        "rgba(59, 130, 246, 0.1)",
      badgeBg:
        hexToRgba(accent, themeMode === "dark" ? 0.3 : 0.12) ??
        "rgba(59, 130, 246, 0.12)",
      badgeTextColor: themeMode === "dark" ? "#E2E8F0" : accent || "#1D4ED8",
    };
  }, [themeMode, type]);

  const backgroundColor = themeBase.bgColor[themeMode];
  const primaryTextColor = themeBase.fontColor[themeMode];
  const secondaryTextColor =
    themeMode === "dark" ? "rgba(226,232,240,0.9)" : "#475569";
  const timestampColor =
    themeMode === "dark" ? "rgba(148,163,184,0.85)" : "#94A3B8";
  const cancelBackground =
    themeMode === "dark" ? "rgba(255,255,255,0.08)" : "#F3F4F6";
  const cancelTextColor = themeMode === "dark" ? "#E2E8F0" : "#475569";
  const closeButtonBg =
    themeMode === "dark" ? "rgba(148,163,184,0.16)" : "#F1F5F9";
  const closeIconColor = themeMode === "dark" ? "#E2E8F0" : "#94A3B8";
  const dividerColor =
    themeMode === "dark" ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.2)";

  const renderIcon = () => {
    if (typeProps.iconSource) {
      return <Image source={typeProps.iconSource} style={styles.icon} />;
    }

    return <Info color={typeProps.accent} size={32} />;
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View
        style={[
          styles.container,
          styles.shadow,
          {
            borderTopColor: typeProps.accent,
            backgroundColor,
          },
          themeMode === "dark" && styles.shadowDark,
        ]}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={[
              typeProps.iconBg,
              hexToRgba(typeProps.accent, 0.35) ?? typeProps.iconBg,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            {renderIcon()}
          </LinearGradient>

          <View style={styles.headerText}>
            {title && (
              <Text style={[styles.title, { color: primaryTextColor }]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                {subtitle}
              </Text>
            )}

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: typeProps.badgeBg,
                    borderColor:
                      themeMode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    { color: typeProps.badgeTextColor },
                  ]}
                >
                  {TYPE_LABELS[type]}
                </Text>
              </View>
              {timestamp && (
                <Text style={[styles.timestamp, { color: timestampColor }]}>
                  {timestamp}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: closeButtonBg }]}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X color={closeIconColor} size={18} />
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        <View style={styles.content}>
          <ScrollView
            style={{ maxHeight: maxContentHeight }}
            contentContainerStyle={styles.messageContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.message, { color: secondaryTextColor }]}>
              {message}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          {showCancel && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: cancelBackground,
                  borderWidth: themeMode === "dark" ? 1 : 0,
                  borderColor:
                    themeMode === "dark"
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.cancelButtonText, { color: cancelTextColor }]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: typeProps.accent },
              showCancel && styles.buttonFlex,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
        {showProgressBar && (
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: hexToRgba(typeProps.accent, 0.15) },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: typeProps.accent,
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: themeBase.borderRadius.regular,
    padding: themeBase.spacing.l,
    borderTopWidth: 4,
    gap: themeBase.spacing.m,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 5,
  },
  shadowDark: {
    shadowOpacity: 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: themeBase.spacing.s,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: themeBase.borderRadius.rounded,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  content: {
    marginBottom: 4,
    width: "100%",
  },
  messageContainer: {
    paddingBottom: themeBase.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: themeBase.spacing.s,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: themeBase.borderRadius.regular,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonFlex: {
    flex: 1,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: themeBase.spacing.s,
    paddingVertical: 4,
    borderRadius: themeBase.borderRadius.rounded,
    borderWidth: StyleSheet.hairlineWidth,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  progressTrack: {
    height: 4,
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: -4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 999,
  },
});

export default NotificationModal;
