import React from "react";
import {
  Link2,
  Trash2,
  CheckCircle,
  SquareCheck,
  Bell,
} from "lucide-react-native";
import { Linking, Pressable, View } from "react-native";
import { NotificationItem } from "../../types/notification";
import { formatRelativeTime } from "../../utils/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  item: NotificationItem;
  onToggleSelect?: (id: number) => void;
  onPress?: (item: NotificationItem) => void;
  onDelete?: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onMarkRead?: (id: number) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onToggleSelect,
  onPress,
  onDelete,
  onMarkRead,
  selectionMode,
  selected,
}) => {
  const handlePress = () => {
    if (selectionMode) {
      onToggleSelect?.(item.id);
    } else {
      onPress?.(item);
    }
  };

  const openLink = () => {
    if (item.href && item.href !== "string") {
      Linking.openURL(item.href).catch(() => {});
    }
  };

  return (
    <Card
      className={cn(
        "border-white/10 bg-white/5",
        !item.isRead && "border-primary/40 shadow-lg shadow-primary/20",
        selected && "border-primary shadow-primary/40",
        item.isRead && "opacity-90"
      )}
    >
      <Pressable onPress={handlePress}>
        <CardContent className="flex-row items-start gap-4 py-5">
          <Avatar
            alt={item.actorDisplayName || "Notification avatar"}
            className="size-12 rounded-2xl border border-white/10 bg-white/10"
          >
            {item.actorAvatarUrl ? (
              <AvatarImage source={{ uri: item.actorAvatarUrl }} />
            ) : (
              <AvatarFallback className="bg-white/5">
                <Bell size={18} color="#a5f3fc" />
              </AvatarFallback>
            )}
          </Avatar>
          <View className="flex-1 gap-2">
            <View className="flex-row items-start justify-between gap-3">
              <CardTitle
                numberOfLines={2}
                className={cn(
                  "text-base text-white",
                  item.isRead && "text-white/80"
                )}
              >
                {item.title}
              </CardTitle>
              {selectionMode && selected && (
                <CheckCircle size={20} color="#34d399" />
              )}
            </View>
            <CardDescription
              numberOfLines={3}
              className="text-sm leading-5 text-white/80"
            >
              {item.message}
            </CardDescription>
            <View className="flex-row flex-wrap items-center justify-between gap-2">
              <View className="flex-row flex-wrap gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/5">
                  <Text className="text-xs font-medium text-white">
                    {item.type.toLowerCase()}
                  </Text>
                </Badge>
                {!item.isRead && (
                  <Badge variant="secondary" className="bg-primary/20">
                    <Text className="text-xs font-medium text-white">New</Text>
                  </Badge>
                )}
              </View>
              <Text className="text-xs uppercase tracking-wide text-white/60">
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
          </View>
        </CardContent>
      </Pressable>
      {!selectionMode && (
        <View className="flex-row flex-wrap items-center gap-2 px-6 pb-5 pt-0">
          {!!item.href && item.href !== "string" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[110px]"
              onPress={openLink}
            >
              <Link2 size={16} />
              <Text className="text-sm font-semibold text-white">Open</Text>
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 min-w-[110px]"
            onPress={() => onMarkRead?.(item.id)}
          >
            <CheckCircle size={16} />
            <Text className="text-sm font-semibold text-white">Mark read</Text>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 min-w-[110px]"
            onPress={() => onToggleSelect?.(item.id)}
          >
            <SquareCheck size={16} />
            <Text className="text-sm font-semibold text-white">Select</Text>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 min-w-[110px]"
            onPress={() => onDelete?.(item.id)}
          >
            <Trash2 size={16} />
            <Text className="text-sm font-semibold text-white">Delete</Text>
          </Button>
        </View>
      )}
    </Card>
  );
};

export default NotificationCard;
