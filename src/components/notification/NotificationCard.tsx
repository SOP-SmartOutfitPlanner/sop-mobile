import React, { useCallback, useMemo } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  ExternalLink,
  Megaphone,
  Sparkles,
  Trash2,
  User,
} from "lucide-react-native";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";
import { NotificationItem, NotificationType } from "../../types/notification";
import { formatRelativeTime } from "../../utils/dateUtils";

// Strip HTML tags and decode basic entities
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

// Get icon based on notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "USER":
      return <User size={16} color="#a5b4fc" />;
    case "SYSTEM":
      return <Bell size={16} color="#60a5fa" />;
    case "AI":
      return <Sparkles size={16} color="#34d399" />;
    case "PROMO":
      return <Megaphone size={16} color="#fbbf24" />;
    default:
      return <Bell size={16} color="#94a3b8" />;
  }
};

// Get badge color based on type
const getTypeBadgeStyle = (type: NotificationType) => {
  switch (type) {
    case "USER":
      return "bg-indigo-500/20 border-indigo-400/30";
    case "SYSTEM":
      return "bg-blue-500/20 border-blue-400/30";
    case "AI":
      return "bg-emerald-500/20 border-emerald-400/30";
    case "PROMO":
      return "bg-amber-500/20 border-amber-400/30";
    default:
      return "bg-white/10 border-white/20";
  }
};

interface NotificationCardProps {
  item: NotificationItem;
  onToggleSelect?: (id: number) => void;
  onPress?: (item: NotificationItem) => void;
  onDelete?: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onMarkRead?: (id: number) => void;
}

const PLACEHOLDER_WORDS = new Set(["string", "null", "undefined"]);

const sanitizeText = (value?: string, fallback?: string): string => {
  if (typeof value !== "string") {
    return fallback || "";
  }

  // Strip HTML and clean up
  const cleaned = stripHtml(value);
  if (!cleaned || PLACEHOLDER_WORDS.has(cleaned.toLowerCase())) {
    return fallback || "";
  }

  return cleaned;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onToggleSelect,
  onPress,
  onDelete,
  onMarkRead,
  selectionMode,
  selected,
}) => {
  const { normalizedHref, canOpenLink, titleText, messageText } =
    useMemo(() => {
      const href = typeof item.href === "string" ? item.href.trim() : "";
      return {
        normalizedHref: href,
        canOpenLink: href.length > 0 && href !== "string",
        titleText: sanitizeText(item.title, "Notification"),
        messageText: sanitizeText(item.message, ""),
      };
    }, [item.href, item.title, item.message]);

  const handlePress = () => {
    if (selectionMode) {
      onToggleSelect?.(item.id);
    } else {
      onPress?.(item);
    }
  };

  const handleOpenLink = useCallback(() => {
    if (!canOpenLink) return;
    Linking.openURL(normalizedHref).catch(() => {});
  }, [canOpenLink, normalizedHref]);

  const gradientColors: [string, string] = item.isRead
    ? ["#0f172a", "#0c1322"]
    : ["#1e3a5f", "#0f172a"];

  const cardStyle = [
    styles.card,
    !item.isRead && styles.cardUnread,
    selected && styles.cardSelected,
  ];

  // Render avatar or icon
  const renderAvatar = () => {
    if (item.actorAvatarUrl) {
      return (
        <Image
          source={{ uri: item.actorAvatarUrl }}
          className="size-11 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
      );
    }
    return (
      <View
        className={cn(
          "size-11 items-center justify-center rounded-full",
          getTypeBadgeStyle(item.type)
        )}
      >
        {getNotificationIcon(item.type)}
      </View>
    );
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.gradientShell}>
      <Pressable style={cardStyle} onPress={handlePress}>
        {/* Header Row */}
        <View className="flex-row items-start gap-3">
          {/* Avatar/Icon */}
          {renderAvatar()}

          {/* Content */}
          <View className="flex-1 gap-1.5">
            {/* Title Row */}
            <View className="flex-row items-start justify-between gap-2">
              <Text
                numberOfLines={1}
                className={cn(
                  "flex-1 text-[15px] font-semibold",
                  item.isRead ? "text-white/80" : "text-white"
                )}
              >
                {titleText}
              </Text>

              {/* Selection or Delete */}
              {selectionMode ? (
                <View
                  className={cn(
                    "size-6 items-center justify-center rounded-full border",
                    selected
                      ? "border-emerald-400 bg-emerald-500/20"
                      : "border-white/30 bg-white/5"
                  )}
                >
                  {selected && <CheckCircle size={14} color="#34d399" />}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={(event) => {
                    event?.stopPropagation?.();
                    onDelete?.(item.id);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1"
                >
                  <Trash2 size={16} color="#f87171" />
                </TouchableOpacity>
              )}
            </View>

            {/* Actor name if available */}
            {item.actorDisplayName && (
              <Text className="text-xs font-medium text-primary/90">
                {sanitizeText(item.actorDisplayName)}
              </Text>
            )}

            {/* Message */}
            <Text
              className={cn(
                "text-sm leading-5",
                item.isRead ? "text-white/60" : "text-white/80"
              )}
              numberOfLines={2}
            >
              {messageText}
            </Text>

            {/* Footer: Time + Badges + Actions */}
            <View className="mt-2 flex-row items-center justify-between">
              {/* Left: Time + Type Badge */}
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-1">
                  <Clock size={12} color="rgba(148,163,184,0.8)" />
                  <Text className="text-[11px] text-white/50">
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>

                {/* Type badge - compact */}
                {/* <View
                  className={cn(
                    "flex-row items-center gap-1 rounded-full px-2 py-0.5",
                    getTypeBadgeStyle(item.type)
                  )}
                >
                  {getNotificationIcon(item.type)}
                  <Text className="text-[10px] font-medium uppercase text-white/70">
                    {item.type}
                  </Text>
                </View> */}

                {/* Unread indicator */}
                {!item.isRead && (
                  <View className="size-2 rounded-full bg-primary" />
                )}
              </View>

              {/* Right: Action button */}
              {/* {canOpenLink && (
                // <TouchableOpacity
                //   onPress={(event) => {
                //     event?.stopPropagation?.();
                //     handleOpenLink();
                //   }}
                //   className="flex-row items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"
                //   activeOpacity={0.7}
                // >
                //   <ExternalLink size={12} color="#60a5fa" />
                //   <Text className="text-[11px] font-semibold text-white/90">
                //     Open
                //   </Text>
                // </TouchableOpacity>
              )} */}
            </View>
          </View>
        </View>
      </Pressable>
    </LinearGradient>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  gradientShell: {
    borderRadius: 16,
    padding: 1,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.15)",
    backgroundColor: "rgba(15,23,42,0.95)",
  },
  cardUnread: {
    borderColor: "rgba(96,165,250,0.4)",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardSelected: {
    borderColor: "#60a5fa",
    backgroundColor: "rgba(30,58,95,0.9)",
  },
});
