export type NotificationType = "SYSTEM" | "USER" | "AI" | "PROMO";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  href?: string | null;
  type: NotificationType;
  imageUrl?: string | null;
  actorUserId?: number | null;
  actorDisplayName?: string | null;
  actorAvatarUrl?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationMeta {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NotificationListResponse {
  data: NotificationItem[];
  metaData: NotificationMeta;
}

