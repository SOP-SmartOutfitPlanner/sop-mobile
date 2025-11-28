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
  Clock,
  Filter,
  Settings2,
} from "lucide-react-native";
import { useAuth } from "../hooks/auth";
import NotificationCard from "../components/notification/NotificationCard";
import { NotificationFilterKey } from "../components/notification/NotificationFilters";
import { NotificationItem, NotificationMeta } from "../types/notification";
import {
  deleteNotifications,
  fetchUnreadNotificationCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/endpoint/notification";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "../utils/dateUtils";

const PAGE_SIZE = 10;

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
    description: string;
  }> = [
    { key: "all", label: "All", description: "Every notification" },
    { key: "unread", label: "Unread", description: "Needs attention" },
    { key: "system", label: "System", description: "Product updates" },
    { key: "user", label: "User", description: "Direct mentions" },
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
    <SafeAreaView className="flex-1 bg-[#020617]">
      <View className="flex-1">
        <View className="gap-4 px-5 py-4">
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
                <Filter size={18} color="#e2e8f0" />
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
            <Text className="text-sm font-semibold text-white/80">
              Filter feed ({unreadCount} unread)
            </Text>
            <TouchableOpacity
              className={cn(
                "rounded-2xl px-4 py-2",
                selectionMode
                  ? "bg-primary/20"
                  : "border border-white/20 bg-transparent"
              )}
              onPress={toggleSelectionMode}
            >
              <Text className="text-sm font-semibold text-white">
                {selectionMode ? "Exit select" : "Select"}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            <View className="flex-row gap-3">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setFilter(option.key)}
                  className={cn(
                    "min-w-[130px] rounded-2xl border px-4 py-3",
                    option.key === filter
                      ? "border-primary bg-primary/15"
                      : "border-white/15 bg-white/5"
                  )}
                >
                  <Text className="text-base font-semibold text-white">
                    {option.label}
                  </Text>
                  <Text className="text-xs text-white/70">
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
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
        <View className="flex-1 justify-end bg-black/60">
          <View className="rounded-t-3xl bg-[#0f172a] p-5">
            {activeNotification && (
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="rounded-full border border-white/20 p-2">
                    <Bell size={18} color="#e2e8f0" />
                  </View>
                  <Text className="flex-1 text-lg font-semibold text-white">
                    {activeNotification.title}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color="rgba(226,232,240,0.7)" />
                  <Text className="text-sm text-white/70">
                    {formatRelativeTime(activeNotification.createdAt)}
                  </Text>
                </View>
                <Text className="text-base leading-6 text-white/80">
                  {activeNotification.message}
                </Text>
                {activeNotification.href &&
                  activeNotification.href !== "string" && (
                    <TouchableOpacity
                      className="rounded-2xl bg-primary px-4 py-3"
                      onPress={() =>
                        Linking.openURL(activeNotification.href!).catch(
                          () => {}
                        )
                      }
                    >
                      <Text className="text-center text-sm font-semibold text-white">
                        Open related link
                      </Text>
                    </TouchableOpacity>
                  )}
                <TouchableOpacity
                  className="rounded-2xl border border-white/20 px-4 py-3"
                  onPress={() => setDetailOpen(false)}
                >
                  <Text className="text-center text-sm font-semibold text-white">
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationScreen;
