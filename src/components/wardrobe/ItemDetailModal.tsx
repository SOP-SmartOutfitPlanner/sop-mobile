import React from "react";
import { View, Modal, ScrollView, StyleSheet } from "react-native";
import { Item } from "../../types/item";
import {
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailStats,
  DetailProperties,
  DetailActions,
} from "./detail";

interface ItemDetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: Item | null;
  onUseInOutfit: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  onClose,
  item,
  onUseInOutfit,
}) => {
  if (!item) return null;

  // Parse data
  const tags = item.tag ? item.tag.split(",").map((t) => t.trim()) : [];
  const wearCount = item.frequencyWorn || "0";
  const lastWornDate = item.lastWornAt
    ? new Date(item.lastWornAt).toLocaleDateString()
    : "Never";

  const handleUseInOutfit = () => {
    onUseInOutfit(item);
  };

  const handleEdit = () => {
    console.log("Edit item:", item.id);
    // TODO: Navigate to edit screen
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <DetailHeader onClose={onClose} isFavorite={false} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DetailImage imageUrl={item.imgUrl} />

          <DetailInfo name={item.name} brand={item.brand} tags={tags} />

          <DetailStats
            wearCount={wearCount}
            condition={(item.condition as any) || "Good"}
            lastWorn={lastWornDate}
          />

          <DetailProperties
            category={item.categoryName}
            color={item.color}
            weather={item.weatherSuitable ? [item.weatherSuitable] : []}
            fabric={item.fabric}
            pattern={item.pattern}
            aiDescription={item.aiDescription}
          />

          <DetailActions
            onUseInOutfit={handleUseInOutfit}
            onEdit={handleEdit}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
