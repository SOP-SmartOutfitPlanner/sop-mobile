import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

// Import icon từ lucide-react-native
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react-native";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationModalProps {
  isVisible: boolean;
  type?: NotificationType;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isVisible,
  type = "info",
  title,
  message,
  onClose,
  confirmText = "OK",
  cancelText = "Hủy",
  onConfirm,
  showCancel = false,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const getTypeProps = (): {
    containerStyle: ViewStyle;
    icon: JSX.Element;
    iconBg: string;
  } => {
    switch (type) {
      case "success":
        return {
          containerStyle: { borderTopColor: "#10B981" },
          icon: <CheckCircle color="#fff" size={36} />,
          iconBg: "#10B981",
        };
      case "error":
        return {
          containerStyle: { borderTopColor: "#EF4444" },
          icon: <XCircle color="#fff" size={36} />,
          iconBg: "#EF4444",
        };
      case "warning":
        return {
          containerStyle: { borderTopColor: "#F59E0B" },
          icon: <AlertTriangle color="#fff" size={36} />,
          iconBg: "#F59E0B",
        };
      case "info":
      default:
        return {
          containerStyle: { borderTopColor: "#3B82F6" },
          icon: <Info color="#fff" size={36} />,
          iconBg: "#3B82F6",
        };
    }
  };

  const typeProps = getTypeProps();

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
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={["rgba(59,130,246,0.15)", "rgba(147,51,234,0.15)"]}
          style={[styles.container, typeProps.containerStyle]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: typeProps.iconBg }]}
          >
            {typeProps.icon}
          </View>

          <View style={styles.content}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.message}>{message}</Text>
          </View>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: typeProps.iconBg }]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "90%",
    alignSelf: "center",
  },
  container: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(15,23,42,0.95)",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "rgba(148,163,184,0.15)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
  },
  cancelButtonText: {
    color: "#cbd5f5",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationModal;
