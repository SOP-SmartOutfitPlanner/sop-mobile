import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FavoriteTabsProps {
  activeTab: "Outfits" | "Items";
  onTabChange: (tab: "Outfits" | "Items") => void;
}

const FavoriteTabs: React.FC<FavoriteTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Outfits" && styles.activeTab]}
        onPress={() => onTabChange("Outfits")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Outfits" && styles.activeTabText,
          ]}
        >
          Outfits
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Items" && styles.activeTab]}
        onPress={() => onTabChange("Items")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Items" && styles.activeTabText,
          ]}
        >
          Items
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#1E293B",
    fontWeight: "600",
  },
});

export default FavoriteTabs;
