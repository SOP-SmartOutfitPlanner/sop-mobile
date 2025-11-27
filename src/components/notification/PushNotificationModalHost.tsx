import React, { useEffect } from "react";
import {
  DeviceEventEmitter,
  EmitterSubscription,
  Platform,
} from "react-native";
import NotificationModal from "./NotificationModal";
import { useNotification } from "../../hooks";

export type PushModalPayload = {
  title?: string;
  subtitle?: string;
  message: string;
  timestamp?: string;
  confirmText?: string;
  cancelText?: string;
  data?: Record<string, any>;
};

export const PUSH_MODAL_EVENT = "SOP_PUSH_NOTIFICATION_MODAL";

export const emitPushModalEvent = (payload: PushModalPayload) => {
  DeviceEventEmitter.emit(PUSH_MODAL_EVENT, payload);
};

export const PushNotificationModalHost: React.FC = () => {
  const { visible, config, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    let subscription: EmitterSubscription | undefined;

    subscription = DeviceEventEmitter.addListener(
      PUSH_MODAL_EVENT,
      (payload: PushModalPayload) => {
        showNotification({
          type: payload?.data?.type || "info",
          title:
            payload.title ||
            (Platform.OS === "ios"
              ? "Smart Outfit Planner"
              : "SmartOutfitPlanner"),
          subtitle: payload.subtitle || payload.data?.subtitle,
          timestamp: payload.timestamp || payload.data?.timestamp,
          message: payload.message,
          confirmText: payload.confirmText,
          cancelText: payload.cancelText,
          showCancel: !!payload.cancelText,
        });
      }
    );

    return () => {
      subscription?.remove();
    };
  }, [showNotification]);

  return (
    <NotificationModal
      isVisible={visible}
      type={config.type}
      title={config.title}
      message={config.message}
      onClose={hideNotification}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      onConfirm={config.onConfirm}
      showCancel={config.showCancel}
    />
  );
};

export default PushNotificationModalHost;
