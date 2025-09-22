import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WardrobeItem } from "../../types";
import { ItemCard } from "./ItemCard";

const { width } = Dimensions.get("window");

interface WardrobeItemGridProps {
  items: WardrobeItem[];
  viewMode: "grid" | "list";
  onItemClick: (item: WardrobeItem) => void;
}

export const WardrobeItemGrid: React.FC<WardrobeItemGridProps> = ({
  items,
  viewMode,
  onItemClick,
}) => {
  const itemWidth = viewMode === "grid" ? (width - 48) / 2 - 8 : width - 32;

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemWrapper,
            {
              width: itemWidth,
              marginRight: viewMode === "grid" && index % 2 === 0 ? 16 : 0,
            },
          ]}
        >
          <ItemCard item={item} onItemClick={onItemClick} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemWrapper: {
    marginBottom: 16,
  },
});
