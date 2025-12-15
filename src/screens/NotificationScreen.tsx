import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleDot,
  Clock,
  ExternalLink,
  Inbox,
  Megaphone,
  Settings2,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react-native";
import { Image } from "react-native";
import { useAuth } from "../hooks/auth";
import NotificationCard from "../components/notification/NotificationCard";
import { NotificationFilterKey } from "../components/notification/NotificationFilters";
import {
  NotificationItem,
  NotificationMeta,
  NotificationType,
} from "../types/notification";
import AnimatedBackground from "../components/common/AnimatedBackground";
import {
  deleteNotifications,
  fetchUnreadNotificationCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/endpoint/notification";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "../utils/dateUtils";
import { LinearGradient } from "expo-linear-gradient";

const PAGE_SIZE = 10;

// Strip HTML tags helper
const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Get notification type config
const getNotificationTypeConfig = (type: NotificationType) => {
  switch (type) {
    case "USER":
      return {
        icon: <User size={20} color="#a5b4fc" />,
        label: "User Activity",
        bgColor: "bg-indigo-500/20",
        borderColor: "border-indigo-400/30",
        gradient: ["#312e81", "#1e1b4b"] as [string, string],
      };
    case "SYSTEM":
      return {
        icon: <Bell size={20} color="#60a5fa" />,
        label: "System Update",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-400/30",
        gradient: ["#1e3a8a", "#172554"] as [string, string],
      };
    case "AI":
      return {
        icon: <Sparkles size={20} color="#34d399" />,
        label: "AI Suggestion",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-400/30",
        gradient: ["#065f46", "#064e3b"] as [string, string],
      };
    case "PROMO":
      return {
        icon: <Megaphone size={20} color="#fbbf24" />,
        label: "Promotion",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-400/30",
        gradient: ["#92400e", "#78350f"] as [string, string],
      };
    default:
      return {
        icon: <Bell size={20} color="#94a3b8" />,
        label: "Notification",
        bgColor: "bg-white/10",
        borderColor: "border-white/20",
        gradient: ["#1e293b", "#0f172a"] as [string, string],
      };
  }
};

export const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isGuest } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [meta, setMeta] = useState<NotificationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationFilterKey>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const typeFilterParam = useMemo(() => {
    switch (filter) {
      case "system":
        return 0;
      case "user":
        return 1;
      default:
        return undefined;
    }
  }, [filter]);

  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const count = await fetchUnreadNotificationCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [user]);

  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      if (reset) {
        setLoading(true);
      }

      try {
        const response = await fetchUserNotifications({
          userId: user.id,
          pageIndex: reset ? 1 : (meta?.currentPage || 1) + 1,
          pageSize: PAGE_SIZE,
          type: typeFilterParam,
          isRead: filter === "unread" ? false : undefined,
        });

        setMeta(response.metaData);
        setNotifications((prev) =>
          reset ? response.data : [...prev, ...response.data]
        );
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user, meta?.currentPage, filter, typeFilterParam]
  );

  useEffect(() => {
    setSelectedIds([]);
    setSelectionMode(false);
    fetchNotifications(true);
  }, [fetchNotifications, filter]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true);
      loadUnreadCount();
    }, [fetchNotifications, loadUnreadCount])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev);
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const markSelectedAsRead = () => {
    Promise.all(
      selectedIds.map((id) => markNotificationAsRead(id).catch(() => {}))
    ).finally(() => {
      setNotifications((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id) ? { ...item, isRead: true } : item
        )
      );
      setSelectedIds([]);
      setSelectionMode(false);
      loadUnreadCount();
    });
  };

  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const idsToDelete = [...selectedIds];
    setNotifications((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );
    setSelectedIds([]);
    setSelectionMode(false);

    try {
      await deleteNotifications(idsToDelete);
    } catch (error) {
      console.error("Failed to delete notifications:", error);
      fetchNotifications(true);
    }
  }, [fetchNotifications, selectedIds]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [activeNotification, setActiveNotification] =
    useState<NotificationItem | null>(null);

  const handleOpenNotification = async (item: NotificationItem) => {
    setActiveNotification(item);
    setDetailOpen(true);
    try {
      await markNotificationAsRead(item.id);
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    } finally {
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === item.id ? { ...noti, isRead: true } : noti
        )
      );
      loadUnreadCount();
    }
  };

  const filterOptions: Array<{
    key: NotificationFilterKey;
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: "all", label: "All", icon: <Inbox size={16} color="#a5b4fc" /> },
    {
      key: "unread",
      label: "Unread",
      icon: <CircleDot size={16} color="#f97316" />,
    },
    {
      key: "system",
      label: "System",
      icon: <Settings2 size={16} color="#60a5fa" />,
    },
    { key: "user", label: "User", icon: <Users size={16} color="#34d399" /> },
  ];

  const renderSelectionToolbar = () => {
    if (!selectionMode || selectedIds.length === 0) {
      return null;
    }

    return (
      <View className="mx-5 mt-4 rounded-2xl border border-primary/40 bg-primary/10 p-4">
        <Text className="text-base font-semibold text-white/90">
          {selectedIds.length} selected
        </Text>
        <View className="mt-3 flex-row gap-3">
          <TouchableOpacity
            className="flex-1 rounded-2xl bg-white/15 px-4 py-3"
            onPress={markSelectedAsRead}
            activeOpacity={0.85}
          >
            <Text className="text-center text-sm font-semibold text-white">
              Mark read
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-2xl border border-white/20 px-4 py-3"
            onPress={deleteSelected}
            activeOpacity={0.85}
          >
            <Text className="text-center text-sm font-semibold text-white">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      if (distanceFromBottom < 120 && meta?.hasNext && !loading) {
        fetchNotifications();
      }
    },
    [fetchNotifications, loading, meta?.hasNext]
  );

  if (isGuest) {
    return (
      <SafeAreaView className="flex-1 bg-[#020617]">
        <View className="flex-1 items-center justify-center gap-5 px-8">
          <Text className="text-center text-2xl font-bold text-white">
            Sign in to stay updated
          </Text>
          <Text className="text-center text-base text-white/70">
            Create an account or log in to receive personalized notifications.
          </Text>
          <TouchableOpacity
            className="w-full rounded-2xl bg-primary px-6 py-3"
            onPress={() => navigation.navigate("Auth" as never)}
          >
            <Text className="text-center text-base font-semibold text-white">
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <AnimatedBackground />
      <View className="flex-1">
        <View className="gap-4 px-5 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="rounded-full border border-white/20 p-2"
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#e2e8f0" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Notifications</Text>
            <TouchableOpacity
              className="rounded-full border border-white/20 p-2"
              onPress={toggleSelectionMode}
            >
              {selectionMode ? (
                <X size={18} color="#e2e8f0" />
              ) : (
                <Settings2 size={18} color="#e2e8f0" />
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-white/70">
              Showing {notifications.length} notifications
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-2 rounded-2xl border border-white/20 px-3 py-2"
              onPress={async () => {
                if (!user) return;
                try {
                  await markAllNotificationsAsRead(user.id);
                } catch (error) {
                  console.error("Failed to mark all read:", error);
                } finally {
                  setNotifications((prev) =>
                    prev.map((item) => ({ ...item, isRead: true }))
                  );
                  loadUnreadCount();
                }
              }}
            >
              <ChevronRight size={16} color="#e2e8f0" />
              <Text className="text-sm font-semibold text-white">
                Mark all read
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-white/70">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "No unread notifications"}
            </Text>
            <TouchableOpacity
              className={cn(
                "rounded-full px-3 py-1.5",
                selectionMode
                  ? "bg-primary/30"
                  : "border border-white/20 bg-transparent"
              )}
              onPress={toggleSelectionMode}
            >
              <Text className="text-xs font-semibold text-white">
                {selectionMode ? "Done" : "Select"}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 8 }}
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setFilter(option.key)}
                className={cn(
                  "flex-row items-center gap-2.5 rounded-2xl border px-4 py-2.5",
                  option.key === filter
                    ? "border-primary bg-primary/25"
                    : "border-white/20 bg-white/5"
                )}
                activeOpacity={0.7}
              >
                {option.icon}
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    option.key === filter ? "text-white" : "text-white/70"
                  )}
                >
                  {option.label}
                </Text>
                {option.key === "unread" && unreadCount > 0 && (
                  <View className="min-w-[22px] items-center rounded-full bg-orange-500 px-1.5 py-0.5">
                    <Text className="text-[10px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {renderSelectionToolbar()}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 72 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="gap-4">
            {notifications.map((item, index) => (
              <NotificationCard
                key={`${item.id}-${item.createdAt}-${index}`}
                item={item}
                selectionMode={selectionMode}
                selected={selectedIds.includes(item.id)}
                onToggleSelect={toggleSelect}
                onPress={handleOpenNotification}
                onDelete={async (id) => {
                  setNotifications((prev) =>
                    prev.filter((notification) => notification.id !== id)
                  );
                  try {
                    await deleteNotifications([id]);
                  } catch (error) {
                    console.error("Failed to delete notification:", error);
                    fetchNotifications(true);
                  }
                }}
                onMarkRead={(id) =>
                  markNotificationAsRead(id)
                    .catch(() => {})
                    .finally(() => {
                      setNotifications((prev) =>
                        prev.map((notification) =>
                          notification.id === id
                            ? { ...notification, isRead: true }
                            : notification
                        )
                      );
                      loadUnreadCount();
                    })
                }
              />
            ))}
            {!loading && notifications.length === 0 && (
              <View className="items-center gap-3 py-20">
                <Bell size={32} color="rgba(226,232,240,0.7)" />
                <Text className="text-xl font-semibold text-white">
                  All caught up!
                </Text>
                <Text className="text-center text-base text-white/70">
                  You&apos;ll see new updates here as soon as we have them.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={detailOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/70"
          activeOpacity={1}
          onPress={() => setDetailOpen(false)}
        >
          <View className="flex-1" />
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="rounded-t-[32px] overflow-hidden">
              {activeNotification && (
                <LinearGradient
                  colors={
                    getNotificationTypeConfig(activeNotification.type).gradient
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="px-5 pb-10 pt-4"
                >
                  {/* Handle bar */}
                  <View className="mb-5 self-center h-1.5 w-14 rounded-full bg-white/30" />

                  {/* Close button */}
                  <TouchableOpacity
                    className="absolute right-4 top-4 rounded-full bg-white/10 p-2"
                    onPress={() => setDetailOpen(false)}
                  >
                    <X size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* Type Badge */}
                  {/* <View
                    className={cn(
                      "self-start flex-row items-center gap-2 rounded-full px-3 py-1.5 mb-4",
                      getNotificationTypeConfig(activeNotification.type)
                        .bgColor,
                      "border",
                      getNotificationTypeConfig(activeNotification.type)
                        .borderColor
                    )}
                  >
                    {getNotificationTypeConfig(activeNotification.type).icon}
                    <Text className="text-xs font-semibold text-white/90">
                      {getNotificationTypeConfig(activeNotification.type).label}
                    </Text>
                  </View> */}

                  {/* Avatar + Title */}
                  <View className="flex-row items-start gap-4 mb-4">
                    {activeNotification.actorAvatarUrl ? (
                      <Image
                        source={{ uri: activeNotification.actorAvatarUrl }}
                        className="size-14 rounded-2xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      />
                    ) : (
                      <View
                        className={cn(
                          "size-14 items-center justify-center rounded-2xl",
                          getNotificationTypeConfig(activeNotification.type)
                            .bgColor
                        )}
                      >
                        {
                          getNotificationTypeConfig(activeNotification.type)
                            .icon
                        }
                      </View>
                    )}
                    <View className="flex-1 gap-1">
                      <Text className="text-xl font-bold text-white leading-7">
                        {stripHtml(activeNotification.title) || "Notification"}
                      </Text>
                      {activeNotification.actorDisplayName && (
                        <Text className="text-sm font-medium text-white/70">
                          by {stripHtml(activeNotification.actorDisplayName)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Time + Read Status */}
                  <View className="flex-row items-center gap-4 mb-5 px-1">
                    <View className="flex-row items-center gap-2">
                      <Clock size={14} color="rgba(255,255,255,0.6)" />
                      <Text className="text-sm text-white/60">
                        {formatRelativeTime(activeNotification.createdAt)}
                      </Text>
                    </View>
                    {!activeNotification.isRead && (
                      <View className="flex-row items-center gap-1.5">
                        <View className="size-2 rounded-full bg-primary" />
                        <Text className="text-xs font-medium text-primary">
                          Unread
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Message Content */}
                  <View className="rounded-2xl bg-black/20 p-4 mb-5">
                    <Text className="text-base leading-7 text-white/90">
                      {stripHtml(activeNotification.message) ||
                        "No content available."}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View className="gap-3">
                    {/* {activeNotification.href &&
                      activeNotification.href !== "string" && (
                        <TouchableOpacity
                          className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-white px-5 py-4"
                          onPress={() =>
                            Linking.openURL(activeNotification.href!).catch(() => {})
                          }
                          activeOpacity={0.85}
                        >
                          <ExternalLink size={18} color="#1e293b" />
                          <Text className="text-base font-bold text-slate-800">
                            View Details
                          </Text>
                        </TouchableOpacity>
                      )} */}
                    <TouchableOpacity
                      className="rounded-2xl border-2 border-white/20 px-5 py-3.5"
                      onPress={() => setDetailOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-center text-base font-semibold text-white/80">
                        Dismiss
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationScreen;
