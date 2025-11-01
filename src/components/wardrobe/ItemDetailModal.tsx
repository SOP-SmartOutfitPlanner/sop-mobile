import React, { useState, useEffect } from "react";
import { View, Modal, ScrollView, StyleSheet } from "react-native";
import { Item, ItemEdit } from "../../types/item";
import {
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailStats,
  DetailProperties,
  DetailMetadata,
  DetailActions,
} from "./detail";
import { EditItemModal } from "./modal/EditItemModal";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../notification/NotificationModal";

interface ItemDetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: Item | null;
  onUseInOutfit: (item: Item) => void;
  onRefresh?: () => void;
  editItem: (id: number, data: Partial<ItemEdit>) => Promise<ItemEdit>;
  deleteItem: (id: number) => Promise<void>;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  onClose,
  item,
  onUseInOutfit,
  onRefresh,
  editItem,
  deleteItem,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const notification = useNotification();

  // Reset notification when modal closes or item changes
  useEffect(() => {
    if (!visible) {
      notification.hideNotification();
    }
  }, [visible]);

  useEffect(() => {
    // Reset notification when switching to a different item
    notification.hideNotification();
  }, [item?.id]);

  if (!item) return null;

  // Parse data
  const wearCount = item.frequencyWorn || "0";
  const lastWornDate = item.lastWornAt
    ? new Date(item.lastWornAt).toLocaleDateString()
    : "Never";

  // Extract names from styles, occasions, and seasons objects
  const itemStyles = item.styles?.map(s => s.name) || [];
  const itemOccasions = item.occasions?.map(o => o.name) || [];
  const itemSeasons = item.seasons?.map(s => s.name) || [];

  const handleUseInOutfit = () => {
    onUseInOutfit(item);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSave = () => {
    setShowEditModal(false);
    onRefresh?.();
  };

  const handleDelete = () => {
    notification.showConfirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteItem(item.id);
          notification.hideNotification();
          onClose(); // Close modal after successful delete
          onRefresh?.(); // Refresh the list
        } catch (error) {
          notification.hideNotification();
          // Show error notification after a short delay
          setTimeout(() => {
            notification.showError("Failed to delete item. Please try again.");
          }, 300);
        }
      },
      {
        title: "Delete Item",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "error",
      }
    );
  };

  return (
    <>
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

            <DetailInfo name={item.name} brand={item.brand} />

            <DetailStats
              wearCount={wearCount}
              condition={(item.condition as any) || "Good"}
              lastWorn={lastWornDate}
            />

            <DetailMetadata
              stylesList={itemStyles}
              occasions={itemOccasions}
              seasons={itemSeasons}
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
              onDelete={handleDelete}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Item Modal */}
      <EditItemModal
        visible={showEditModal}
        onClose={handleEditClose}
        onSave={handleEditSave}
        item={item}
        editItem={editItem}
      />

      {/* Notification Modal */}
      <NotificationModal
        isVisible={notification.visible}
        type={notification.config.type}
        title={notification.config.title}
        message={notification.config.message}
        confirmText={notification.config.confirmText}
        cancelText={notification.config.cancelText}
        showCancel={notification.config.showCancel}
        onConfirm={() => {
          notification.config.onConfirm?.();
        }}
        onClose={notification.hideNotification}
      />
    </>
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
