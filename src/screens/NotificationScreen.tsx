import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  Linking,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";
import NotificationHero from "../components/notification/NotificationHero";
import NotificationFilters, {
  NotificationFilterKey,
} from "../components/notification/NotificationFilters";
import NotificationCard from "../components/notification/NotificationCard";
import { Button } from "@/components/ui/button";
import { Text as UIButtonText } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationItem, NotificationMeta } from "../types/notification";
import {
  fetchUnreadNotificationCount,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/endpoint/notification";

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

  const heroItem = notifications[0];

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

  const loadMore = () => {
    if (meta?.hasNext && !loading) {
      fetchNotifications();
    }
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

  const deleteSelected = () => {
    setNotifications((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const handleOpenNotification = async (item: NotificationItem) => {
    if (item.href && item.href !== "string") {
      Linking.openURL(item.href).catch(() => {});
    }
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            You have {unreadCount} unread updates
          </Text>
        </View>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/10 px-4"
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
          <UIButtonText className="text-sm font-semibold text-white">
            Mark all read
          </UIButtonText>
        </Button>
      </View>
      <NotificationHero
        item={heroItem}
        onPrimaryAction={() => heroItem && handleOpenNotification(heroItem)}
        onSecondaryAction={() => (heroItem ? toggleSelect(heroItem.id) : null)}
      />
      <View style={styles.filterHeader}>
        <Text style={styles.filterLabel}>Filter feed</Text>
        <Button
          variant={selectionMode ? "outline" : "ghost"}
          size="sm"
          className="px-4"
          onPress={toggleSelectionMode}
        >
          <UIButtonText className="text-sm font-semibold text-white">
            {selectionMode ? "Exit select" : "Select"}
          </UIButtonText>
        </Button>
      </View>
      <NotificationFilters
        activeFilter={filter}
        onChange={(value) => setFilter(value)}
      />
    </View>
  );

  const renderSelectionToolbar = () => {
    if (!selectionMode || selectedIds.length === 0) {
      return null;
    }

    return (
      <Card className="mx-4 mt-4 border-primary/40 bg-primary/10">
        <CardContent className="flex-row items-center justify-between gap-4 py-4">
          <Text style={styles.selectionText}>
            {selectedIds.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <Button
              variant="secondary"
              size="sm"
              className="px-4"
              onPress={markSelectedAsRead}
            >
              <UIButtonText className="text-sm font-semibold text-white">
                Mark read
              </UIButtonText>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-4"
              onPress={deleteSelected}
            >
              <UIButtonText className="text-sm font-semibold text-white">
                Delete
              </UIButtonText>
            </Button>
          </View>
        </CardContent>
      </Card>
    );
  };

  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.emptyState, { paddingHorizontal: 32 }]}>
          <Text style={styles.emptyTitle}>Sign in to stay updated</Text>
          <Text style={styles.emptySubtitle}>
            Create an account or log in to receive personalized notifications.
          </Text>
          <Button
            size="lg"
            className="px-6"
            onPress={() => navigation.navigate("Auth" as never)}
          >
            <UIButtonText className="text-base font-semibold text-white">
              Go to Login
            </UIButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderSelectionToolbar()}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            selectionMode={selectionMode}
            selected={selectedIds.includes(item.id)}
            onToggleSelect={toggleSelect}
            onPress={handleOpenNotification}
            onDelete={(id) =>
              setNotifications((prev) =>
                prev.filter((notification) => notification.id !== id)
              )
            }
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
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>
                You&apos;ll see new updates here as soon as we have them.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },
  listContent: {
    padding: 18,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    gap: 24,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e0f2fe",
  },
  subtitle: {
    color: "rgba(226,232,240,0.75)",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLabel: {
    color: "rgba(186,230,253,0.9)",
    fontWeight: "600",
  },
  selectionContainer: {
    margin: 16,
  },
  selectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  selectionText: {
    color: "#dbeafe",
    fontWeight: "600",
  },
  selectionActions: {
    flexDirection: "row",
    gap: 12,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e0f2fe",
  },
  emptySubtitle: {
    color: "rgba(226,232,240,0.75)",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default NotificationScreen;
