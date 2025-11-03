import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WardrobeSectionProps {
  title: string;
  itemCount?: number;
  showViewMore?: boolean;
  viewMoreText?: string;
  onViewMore?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

export const WardrobeSection: React.FC<WardrobeSectionProps> = ({
  title,
  itemCount,
  showViewMore,
  viewMoreText = "Xem thêm",
  onViewMore,
  icon,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#1e293b"
              style={styles.headerIcon}
            />
          )}
          <Text style={styles.title}>{title}</Text>
          {itemCount !== undefined && itemCount > 0 && (
            <Text style={styles.itemCount}>{itemCount} món đồ</Text>
          )}
        </View>
        {showViewMore && (
          <TouchableOpacity onPress={onViewMore} style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>{viewMoreText}</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  itemCount: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewMoreText: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 4,
  },

});
