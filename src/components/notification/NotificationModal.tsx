import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Image,
  ImageSourcePropType,
  Animated,
  ScrollView,
} from "react-native";
import type { ViewStyle } from "react-native";
import Modal from "react-native-modal";

import { Info, X } from "lucide-react-native";
import { chooseDefaultIcon } from "react-native-notificated/lib/commonjs/defaultConfig/choseDefaultIcon";
import { chooseDefaultAccentColor } from "react-native-notificated/lib/commonjs/defaultConfig/stylesUtils";
import { themeBase } from "react-native-notificated/lib/commonjs/defaultConfig/components/theme";
import { LinearGradient } from "expo-linear-gradient";

export type NotificationType = "success" | "error" | "warning" | "info";

type NotificatedTheme = "regular" | "dark";

const TYPE_LABELS: Record<NotificationType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

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
  }, [autoDismissDuration, handleAutoDismiss, isVisible, progress, showProgressBar]);

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
        "rgba(59,130,246,0.1)",
      badgeBg:
        hexToRgba(accent, themeMode === "dark" ? 0.3 : 0.12) ??
        "rgba(59,130,246,0.12)",
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

  const containerStyle = useMemo(
    () => ({
      borderTopColor: typeProps.accent,
      backgroundColor,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: themeMode === "dark" ? 0.05 : 0.15,
      shadowRadius: 18,
      elevation: 5,
    }),
    [backgroundColor, themeMode, typeProps.accent]
  );

  const iconContainerStyle = useMemo<ViewStyle>(
    () => ({
      width: 56,
      height: 56,
      borderRadius: themeBase.borderRadius.rounded,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const renderIcon = () => {
    if (typeProps.iconSource) {
      return (
        <Image
          source={typeProps.iconSource}
          style={{ width: 34, height: 34, resizeMode: "contain" }}
        />
      );
    }

    return <Info color={typeProps.accent} size={32} />;
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.6}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View
        className="space-y-4 rounded-3xl border-t-4 p-6"
        style={containerStyle}
      >
        <View className="flex-row items-center gap-4">
          <LinearGradient
            colors={[
              typeProps.iconBg,
              hexToRgba(typeProps.accent, 0.35) ?? typeProps.iconBg,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={iconContainerStyle}
          >
            {renderIcon()}
          </LinearGradient>

          <View className="flex-1 gap-1">
            {!!title && (
              <Text
                className="text-lg font-bold"
                style={{ color: primaryTextColor }}
              >
                {title}
              </Text>
            )}
            {!!subtitle && (
              <Text className="text-sm" style={{ color: secondaryTextColor }}>
                {subtitle}
              </Text>
            )}

            <View className="mt-1.5 flex-row flex-wrap items-center gap-2">
              <View
                className="rounded-full border px-3 py-1"
                style={{
                  backgroundColor: typeProps.badgeBg,
                  borderColor:
                    themeMode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                }}
              >
                <Text
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: typeProps.badgeTextColor }}
                >
                  {TYPE_LABELS[type]}
                </Text>
              </View>
              {!!timestamp && (
                <Text className="text-xs" style={{ color: timestampColor }}>
                  {timestamp}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            className="size-9 items-center justify-center rounded-full"
            style={{ backgroundColor: closeButtonBg }}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X color={closeIconColor} size={18} />
          </TouchableOpacity>
        </View>

        <View
          className="w-full"
          style={{ backgroundColor: dividerColor, height: 1 }}
        />

        <View className="w-full pb-1">
          <ScrollView
            style={{ maxHeight: maxContentHeight }}
            contentContainerStyle={{ paddingBottom: themeBase.spacing.xs }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              className="text-base font-medium leading-6"
              style={{ color: secondaryTextColor }}
            >
              {message}
            </Text>
          </ScrollView>
        </View>

        <View className="flex-row gap-3">
          {showCancel && (
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-2xl px-6 py-3"
              style={{
                backgroundColor: cancelBackground,
                borderWidth: themeMode === "dark" ? 1 : 0,
                borderColor:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
              }}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: cancelTextColor }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex-1 items-center justify-center rounded-2xl px-6 py-3"
            style={{ backgroundColor: typeProps.accent }}
            onPress={handleConfirm}
            activeOpacity={0.7}
          >
            <Text
              className="text-base font-semibold text-white"
              style={{ textTransform: "capitalize" }}
            >
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>

        {showProgressBar && (
          <View
            className="-mt-1 h-1 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: hexToRgba(typeProps.accent, 0.15) }}
          >
            <Animated.View
              style={{
                height: "100%",
                borderRadius: 999,
                backgroundColor: typeProps.accent,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default NotificationModal;

