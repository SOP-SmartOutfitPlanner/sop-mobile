import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FeedTabsProps {
  activeTab: "Latest" | "Trending" | "Following";
  onTabChange: (tab: "Latest" | "Trending" | "Following") => void;
}

const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{
    key: "Latest" | "Trending" | "Following";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    { key: "Latest", label: "Latest", icon: "time-outline" },
    { key: "Trending", label: "Trending", icon: "trending-up-outline" },
    { key: "Following", label: "Following", icon: "people-outline" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={activeTab === tab.key ? "#6366F1" : "#64748B"}
            style={styles.icon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  activeTab: {
    borderColor: "#6366F1",
    backgroundColor: "#F0F0FF",
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#6366F1",
  },
});

export default FeedTabs;
