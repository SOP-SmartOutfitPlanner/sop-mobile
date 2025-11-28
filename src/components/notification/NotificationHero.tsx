import React from "react";
import { View } from "react-native";
import { Bell } from "lucide-react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { NotificationItem } from "../../types/notification";
import { formatRelativeTime } from "../../utils/dateUtils";

interface NotificationHeroProps {
  item?: NotificationItem;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export const NotificationHero: React.FC<NotificationHeroProps> = ({
  item,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <Card className="border-white/10 bg-white/10">
      <CardHeader className="flex-row items-start gap-4">
        <Avatar className="size-16 rounded-2xl border border-white/10 bg-white/10">
          {item?.actorAvatarUrl ? (
            <AvatarImage source={{ uri: item.actorAvatarUrl }} />
          ) : (
            <AvatarFallback className="bg-white/5">
              <Bell size={22} color="#a5f3fc" />
            </AvatarFallback>
          )}
        </Avatar>
        <View className="flex-1 gap-2">
          <CardTitle className="text-lg text-white">
            {item?.title || "Stay tuned"}
          </CardTitle>
          <CardDescription className="text-white/80">
            {item
              ? item.message
              : "You're all set. We'll let you know when something needs attention."}
          </CardDescription>
          {item && (
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-white/20 bg-white/10">
                <Text className="text-xs font-semibold text-white">
                  {item.type.toLowerCase()}
                </Text>
              </Badge>
              <CardDescription className="text-xs uppercase tracking-wide text-white/70">
                {formatRelativeTime(item.createdAt)}
              </CardDescription>
            </View>
          )}
        </View>
        {item && (
          <Button variant="secondary" size="sm" onPress={onPrimaryAction}>
            <Text className="text-sm font-semibold text-white">Open</Text>
          </Button>
        )}
      </CardHeader>
      {item && (
        <CardContent className="pt-0">
          <View className="flex-row gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onPress={onSecondaryAction}
            >
              <Text className="text-base font-semibold text-white">Share</Text>
            </Button>
            <Button size="lg" className="flex-1" onPress={onPrimaryAction}>
              <Text className="text-base font-semibold text-white">
                Mark read
              </Text>
            </Button>
          </View>
        </CardContent>
      )}
    </Card>
  );
};

export default NotificationHero;

