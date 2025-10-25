import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Modal from "react-native-modal";

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
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={[styles.container, typeProps.containerStyle]}>
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
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              styles.confirmButton,
              { backgroundColor: typeProps.iconBg },
              showCancel && styles.buttonFlex,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFlex: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationModal;
