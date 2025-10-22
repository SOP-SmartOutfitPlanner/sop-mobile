import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Item } from "../../types/item";
import { ItemCard } from "./ItemCard";

const { width } = Dimensions.get("window");

interface WardrobeItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

export const WardrobeItemGrid: React.FC<WardrobeItemGridProps> = ({
  items,
  onItemClick,
}) => {
  const itemWidth = (width - 48) / 2 - 8;

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.itemWrapper,
            {
              width: itemWidth,
              marginRight: index % 2 === 0 ? 16 : 0,
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
