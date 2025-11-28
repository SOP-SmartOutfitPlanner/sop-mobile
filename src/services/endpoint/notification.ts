import apiClient from "../api/apiClient";
import {
  NotificationItem,
  NotificationListResponse,
  NotificationType,
} from "../../types/notification";

export interface FetchNotificationsParams {
  userId: number;
  pageIndex?: number;
  pageSize?: number;
  type?: NotificationType | number;
  isRead?: boolean;
}

export const fetchUserNotifications = async (
  params: FetchNotificationsParams
): Promise<NotificationListResponse> => {
  const { userId, pageIndex = 1, pageSize = 10, type, isRead } = params;

  const response = await apiClient.get(`/notifications/user/${userId}`, {
    params: {
      "page-index": pageIndex,
      "page-size": pageSize,
      ...(typeof type !== "undefined" ? { type } : {}),
      ...(typeof isRead === "boolean" ? { "is-read": isRead } : {}),
    },
  });

  return response.data.data;
};

export const fetchNotificationDetail = async (
  notificationId: number
): Promise<NotificationItem> => {
  const response = await apiClient.get(
    `/notifications/user-notification/${notificationId}`
  );
  return response.data.data;
};

export const fetchUnreadNotificationCount = async (
  userId: number
): Promise<number> => {
  const response = await apiClient.get(
    `/notifications/user/${userId}/unread-count`
  );
  return response.data.data ?? 0;
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await apiClient.put(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (
  userId: number
): Promise<void> => {
  await apiClient.put(`/notifications/user/${userId}/read-all`);
};

export const deleteNotifications = async (
  notificationIds: number[]
): Promise<void> => {
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return;
  }

  await apiClient.delete("/notifications", {
    data: {
      notificationIds,
    },
  });
};

