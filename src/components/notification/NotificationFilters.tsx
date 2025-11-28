import React from "react";
import { View } from "react-native";
import { Bell, Inbox, Shield, Users } from "lucide-react-native";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";

export type NotificationFilterKey = "all" | "unread" | "system" | "user";

interface NotificationFiltersProps {
  activeFilter: NotificationFilterKey;
  onChange: (key: NotificationFilterKey) => void;
}

const filters: Array<{
  key: NotificationFilterKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    key: "all",
    label: "All",
    description: "Every notification",
    icon: <Bell size={18} color="#a5b4fc" />,
  },
  {
    key: "unread",
    label: "Unread",
    description: "Needs attention",
    icon: <Inbox size={18} color="#fef3c7" />,
  },
  {
    key: "system",
    label: "System",
    description: "Product updates",
    icon: <Shield size={18} color="#bae6fd" />,
  },
  {
    key: "user",
    label: "User",
    description: "Direct mentions",
    icon: <Users size={18} color="#a7f3d0" />,
  },
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onChange,
}) => {
  return (
    <Tabs
      value={activeFilter}
      onValueChange={(value) => onChange(value as NotificationFilterKey)}
      className="gap-3"
    >
      <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.key}
            value={filter.key}
            className="basis-[48%] rounded-2xl border border-white/10 bg-white/5 px-3 py-3 data-[state=active]:border-white/20 data-[state=active]:bg-white/10"
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-white/10 rounded-2xl p-2">{filter.icon}</View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">
                  {filter.label}
                </Text>
                <Text className="text-[11px] text-white/70">
                  {filter.description}
                </Text>
              </View>
            </View>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default NotificationFilters;

