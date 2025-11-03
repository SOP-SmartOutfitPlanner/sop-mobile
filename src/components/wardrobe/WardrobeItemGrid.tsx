import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Item } from "../../types/item";
import { ItemCard } from "./ItemCard";

const { width } = Dimensions.get("window");

interface WardrobeItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  columns?: 2 | 3; // Number of columns in grid
}

export const WardrobeItemGrid: React.FC<WardrobeItemGridProps> = ({
  items,
  onItemClick,
  columns = 3,
}) => {
  // Calculate item width based on number of columns
  // Formula: (screen width - padding (16*2) - gaps between items (12*(columns-1))) / columns
  const gaps = 12 * (columns - 1);
  const itemWidth = (width - 32 - gaps) / columns;

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemWrapper,
            {
              width: itemWidth,
              marginRight: (index + 1) % columns === 0 ? 0 : 12,
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
    paddingHorizontal: 16,
  },
  itemWrapper: {
    marginBottom: 12,
  },
});
