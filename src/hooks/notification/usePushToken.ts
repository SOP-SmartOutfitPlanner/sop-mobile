import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@react-native-firebase/app";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import {
  deleteUserDevice,
  registerUserDevice,
} from "../../services/endpoint/device";
import { emitPushModalEvent } from "../../components/notification/PushNotificationModalHost";

const DEVICE_TOKEN_STORAGE_KEY = "@sop_fcm_token";
const ANDROID_NOTIFICATION_CHANNEL_ID = "sop_default";
type NotificationContentWithChannel =
  Notifications.NotificationContentInput & {
    channelId?: string;
  };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ensureAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    ANDROID_NOTIFICATION_CHANNEL_ID,
    {
      name: "General",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
      showBadge: true,
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    }
  );
};

const presentLocalNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) => {
  const title =
    remoteMessage.notification?.title || "Smart Outfit Planner thông báo";
  const rawBody =
    remoteMessage.notification?.body ??
    remoteMessage.data?.message ??
    "Bạn có thông báo mới";
  const body =
    typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody ?? "");

  const content: NotificationContentWithChannel = {
    title,
    body,
    data: remoteMessage.data,
    sound: "default",
  };

  if (Platform.OS === "android") {
    content.channelId = ANDROID_NOTIFICATION_CHANNEL_ID;
  }

  await Notifications.scheduleNotificationAsync({
    content,
    trigger: null,
  });

  emitPushModalEvent({
    title,
    message: body,
    data: remoteMessage.data,
  });
};

messaging().setBackgroundMessageHandler(async () => {});

const fetchFCMToken = async (): Promise<string> => {
  // if (!Device.isDevice) {
  //   throw new Error("FCM token requires running on a physical device.");
  // }

  // Request permission for notifications (iOS only)
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      throw new Error("Push notification permission not granted.");
    }
  }
  // Android: FCM works automatically, no permission request needed

  // Get FCM token
  const fcmToken = await messaging().getToken();
  if (!fcmToken) {
    throw new Error("Failed to get FCM token.");
  }

  return fcmToken;
};

const saveTokenLocally = async (token: string) => {
  await AsyncStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
};

const removeLocalToken = async () => {
  await AsyncStorage.removeItem(DEVICE_TOKEN_STORAGE_KEY);
};

export const usePushToken = () => {
  useEffect(() => {
    ensureAndroidNotificationChannel().catch((error) =>
      console.error("❌ Failed to configure Android notification channel:", error)
    );

    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        try {
          await presentLocalNotification(remoteMessage);
        } catch (notificationError) {
          console.error(
            "❌ Failed to present local notification:",
            notificationError
          );
        }
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      unsubscribeOnMessage();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // Listen for FCM token refresh
    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      await saveTokenLocally(fcmToken);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const registerDevice = useCallback(async (userId?: number | null) => {
    if (!userId) {
      return;
    }

    try {
      const fcmToken = await fetchFCMToken();
      await registerUserDevice({
        userId,
        deviceToken: fcmToken,
        platform: Platform.OS,
      });
      await saveTokenLocally(fcmToken);
    } catch (error) {
      console.error(
        "❌ Failed to register device for push notifications:",
        error
      );
    }
  }, []);

  const unregisterDevice = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
      if (!token) {
        return;
      }

      // Delete token from Firebase
      try {
        await messaging().deleteToken();
      } catch (error) {
        console.warn("⚠️ Failed to delete FCM token from Firebase:", error);
      }

      // Delete from backend
      await deleteUserDevice(token);
    } catch (error) {
      console.error("❌ Failed to unregister device:", error);
    } finally {
      await removeLocalToken();
    }
  }, []);

  return {
    registerDevice,
    unregisterDevice,
  };
};
