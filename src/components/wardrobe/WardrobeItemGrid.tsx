import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Item } from "../../types/item";
import { ItemCard } from "./ItemCard";

const { width } = Dimensions.get("window");

interface WardrobeItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  columns?: number; 
}

export const WardrobeItemGrid: React.FC<WardrobeItemGridProps> = ({
  items,
  onItemClick,
  columns = 3,
}) => {
  const containerPadding = 32; 
  const gap = 12;
  const totalGaps = gap * (columns - 1);
  const itemWidth = (width - containerPadding - totalGaps) / columns;

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemWrapper,
            {
              width: itemWidth,
              marginRight: (index + 1) % columns === 0 ? 0 : gap,
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
