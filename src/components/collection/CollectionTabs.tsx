import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CollectionTab } from "../../hooks/useCollections";
import { COLLECTION_COLORS } from "../../constants/collectionStyles";

interface TabConfig {
  key: CollectionTab;
  label: string;
  disabled?: boolean;
  badge?: string | number;
}

interface CollectionTabsProps {
  tabs: TabConfig[];
  activeTab: CollectionTab;
  onChange: (tab: CollectionTab) => void;
}

export const CollectionTabs: React.FC<CollectionTabsProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              disabled={tab.disabled}
              onPress={() => onChange(tab.key)}
              activeOpacity={0.85}
              style={[styles.chip, isActive && styles.activeChip]}
            >
              {isActive ? (
                <Text style={styles.activeChipText}>{tab.label}</Text>
              ) : (
                <>
                  <Text
                    style={[
                      styles.chipText,
                      tab.disabled && styles.disabledChipText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {typeof tab.badge !== "undefined" && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{tab.badge}</Text>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  content: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLLECTION_COLORS.glass.border,
    backgroundColor: COLLECTION_COLORS.glass.card,
    gap: 8,
    overflow: "hidden",
  },
  activeChip: {
    backgroundColor: COLLECTION_COLORS.accent.cyan,
    borderColor: COLLECTION_COLORS.accent.cyan,
    shadowColor: COLLECTION_COLORS.accent.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  activeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  disabledChip: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLLECTION_COLORS.text.secondary,
  },
  activeChipText: {
    color: COLLECTION_COLORS.text.primary,
    fontWeight: "700",
  },
  disabledChipText: {
    color: COLLECTION_COLORS.text.muted,
  },
  badge: {
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLLECTION_COLORS.glass.light,
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    fontSize: 12,
    color: COLLECTION_COLORS.text.muted,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: COLLECTION_COLORS.text.primary,
  },
});
