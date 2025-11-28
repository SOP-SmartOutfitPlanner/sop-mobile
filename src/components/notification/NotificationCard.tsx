import React, { useCallback, useMemo } from "react";
import { CheckCircle, Clock, Link2, Trash2 } from "lucide-react-native";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";
import { NotificationItem } from "../../types/notification";
import { formatRelativeTime } from "../../utils/dateUtils";

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

const sanitizeText = (value?: string, fallback?: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_WORDS.has(trimmed.toLowerCase())) {
    return fallback;
  }

  return trimmed;
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
  const { normalizedHref, canOpenLink, titleText, messageText } = useMemo(() => {
    if (typeof item.href !== "string") {
      return {
        normalizedHref: "",
        canOpenLink: false,
        titleText: sanitizeText(item.title, "Notification"),
        messageText: sanitizeText(item.message, "No details provided"),
      };
    }
    const trimmed = item.href.trim();
    return {
      normalizedHref: trimmed,
      canOpenLink: trimmed.length > 0 && trimmed !== "string",
      titleText: sanitizeText(item.title, "Notification"),
      messageText: sanitizeText(item.message, "No details provided"),
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
    if (!canOpenLink) {
      return;
    }
    Linking.openURL(normalizedHref).catch(() => {});
  }, [canOpenLink, normalizedHref]);

  const gradientColors = item.isRead
    ? ["#0b1224", "#090f1c"]
    : ["#162a63", "#0a142d"];

  const cardStyle = [
    styles.card,
    !item.isRead && styles.cardUnread,
    selected && styles.cardSelected,
  ];

  const Badge = ({
    children,
    tone = "default",
  }: {
    children: React.ReactNode;
    tone?: "default" | "accent";
  }) => (
    <View
      className={cn(
        "rounded-full border border-white/15 px-3 py-1",
        tone === "accent" && "border-primary/40 bg-primary/20"
      )}
    >
      <Text className="text-xs font-semibold uppercase tracking-wide text-white">
        {children}
      </Text>
    </View>
  );

  const ActionButton: React.FC<{
    onPress?: () => void;
    children: React.ReactNode;
    tone?: "default" | "ghost" | "danger";
  }> = ({ onPress, children, tone = "default" }) => (
    <TouchableOpacity
      onPress={(event) => {
        event?.stopPropagation?.();
        onPress?.();
      }}
      activeOpacity={0.85}
      className={cn(
        "flex-row items-center gap-2 rounded-2xl px-4 py-2",
        tone === "default" && "bg-white/10",
        tone === "ghost" && "bg-transparent border border-white/20",
        tone === "danger" && "bg-red-500/20"
      )}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.gradientShell}>
      <Pressable style={cardStyle} onPress={handlePress}>
      <View className="flex-row items-start gap-4">
        <View className="flex-1 gap-3">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text
                numberOfLines={2}
                className="text-base font-semibold text-white"
              >
                {titleText}
              </Text>
            </View>
            {selectionMode ? (
              <View
                className={cn(
                  "size-7 items-center justify-center rounded-full border",
                  selected ? "border-primary bg-primary/20" : "border-white/25"
                )}
              >
                {selected && <CheckCircle size={18} color="#34d399" />}
              </View>
            ) : (
              <TouchableOpacity
                onPress={(event) => {
                  event?.stopPropagation?.();
                  onDelete?.(item.id);
                }}
                className="rounded-full border border-white/15 bg-white/5 p-2"
              >
                <Trash2 size={16} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Badge>{item.type.toLowerCase()}</Badge>
            {!item.isRead && <Badge tone="accent">New</Badge>}
          </View>
          <Text className="text-sm leading-5 text-white/80" numberOfLines={3}>
            {messageText}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <View className="flex-row items-center gap-2">
          <Clock size={16} color="rgba(226,232,240,0.75)" />
          <Text className="text-xs uppercase tracking-wide text-white/70">
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {canOpenLink && (
            <ActionButton tone="ghost" onPress={handleOpenLink}>
              <Link2 size={16} color="#bae6fd" />
              <Text className="text-xs font-semibold text-white">Open</Text>
            </ActionButton>
          )}
        </View>
      </View>
      </Pressable>
    </LinearGradient>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  gradientShell: {
    borderRadius: 28,
    padding: 1,
  },
  card: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(5,11,23,0.92)",
  },
  cardUnread: {
    borderColor: "rgba(79,140,255,0.6)",
    shadowColor: "#4f8cff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 4,
  },
  cardSelected: {
    borderColor: "#60a5fa",
    backgroundColor: "rgba(14,34,78,0.9)",
  },
});
