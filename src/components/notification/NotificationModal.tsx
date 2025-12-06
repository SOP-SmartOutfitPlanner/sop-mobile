import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export type NotificationType = "success" | "error" | "warning" | "info";

const TYPE_CONFIG: Record<NotificationType, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  accent: string;
}> = {
  success: {
    label: "Success",
    icon: "checkmark-circle",
    gradient: ["#10b981", "#059669"],
    accent: "#10b981",
  },
  error: {
    label: "Error",
    icon: "close-circle",
    gradient: ["#ef4444", "#dc2626"],
    accent: "#ef4444",
  },
  warning: {
    label: "Warning",
    icon: "warning",
    gradient: ["#f59e0b", "#d97706"],
    accent: "#f59e0b",
  },
  info: {
    label: "Info",
    icon: "information-circle",
    gradient: ["#38bdf8", "#0ea5e9"],
    accent: "#38bdf8",
  },
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
  const autoDismissDuration = autoDismissMs ?? 0;
  const progress = useRef(new Animated.Value(0)).current;
  const showProgressBar = autoDismissDuration >= 1500;

  const typeConfig = TYPE_CONFIG[type];

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

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.7}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.modalContainer}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={typeConfig.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={typeConfig.icon} 
                  size={28} 
                  color="#fff" 
                />
              </View>
              <View style={styles.headerTextContainer}>
                {!!title && (
                  <Text style={styles.title}>{title}</Text>
                )}
                {!!subtitle && (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: `${typeConfig.accent}20` }]}>
              <Text style={[styles.badgeText, { color: typeConfig.accent }]}>
                {typeConfig.label}
              </Text>
            </View>
            {!!timestamp && (
              <Text style={styles.timestamp}>{timestamp}</Text>
            )}
          </View>

          <View style={styles.messageContainer}>
            <ScrollView
              style={{ maxHeight: maxContentHeight }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.message}>{message}</Text>
            </ScrollView>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {showCancel && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: typeConfig.accent }]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {showProgressBar && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBackground, { backgroundColor: `${typeConfig.accent}20` }]}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: typeConfig.accent,
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    maxWidth: 400,
    width: "90%",
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(203,213,229,0.7)",
  },
  messageContainer: {
    minHeight: 40,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: "#cbd5f5",
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#cbd5f5",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});

export default NotificationModal;

