import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Item, ItemEdit } from "../../types/item";
import {
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailProperties,
  DetailMetadata,
  DetailActions,
} from "./detail";
import { EditItemModal } from "./modal/EditItemModal";
import NotificationModal from "../notification/NotificationModal";
import { useNotification } from "../../hooks";
import { Ionicons } from "@expo/vector-icons";
import { AnalyzeItems } from "../../services/endpoint/upload";

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnalyzed, setLocalAnalyzed] = useState<boolean>(item?.isAnalyzed || false);
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
    setLocalAnalyzed(item?.isAnalyzed || false);
    setIsAnalyzing(false);
  }, [item?.id]);

  if (!item) return null;

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

  const handleAnalyzeItem = async () => {
    if (!item || isAnalyzing) return;
    try {
      setIsAnalyzing(true);
      const response = await AnalyzeItems([item.id]);

      if (response.statusCode === 200) {
        setLocalAnalyzed(true);
        notification.showSuccess("Item analyzed successfully");
        onRefresh?.();
      } else {
        notification.showError("Analysis failed, please try again");
      }
    } catch (error) {
      notification.showError("Unable to analyze, please try again");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullscreenContainer}>
          <DetailHeader 
            onClose={onClose} 
            onEdit={handleEdit}
            isFavorite={false} 
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <DetailImage 
              imageUrl={item.imgUrl} 
              isAnalyzed={item.isAnalyzed}
            />

            <DetailInfo 
              name={item.name} 
              brand={item.brand}
              color={item.color}
            />

            <DetailProperties
              category={item.categoryName}
              color={item.color}
              weather={item.weatherSuitable ? [item.weatherSuitable] : []}
              fabric={item.fabric}
              pattern={item.pattern}
              condition={item.condition}
              frequencyWorn={item.frequencyWorn}
              brand={item.brand}
            />

            <DetailMetadata
              stylesList={itemStyles}
              occasions={itemOccasions}
              seasons={itemSeasons}
            />

            {/* Single-item analysis */}
            {!localAnalyzed && (
              <View style={styles.analysisContainer}>
                <View style={styles.analysisInfo}>
                  <Ionicons name="analytics-outline" size={18} color="#f59e0b" />
                  <Text style={styles.analysisText}>Analyze this item</Text>
                </View>
                <TouchableOpacity
                  style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                  onPress={handleAnalyzeItem}
                  activeOpacity={0.8}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="flash" size={16} color="#fff" />
                      <Text style={styles.analyzeButtonText}>Analyze</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#030617",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  analysisContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  analysisInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  analysisText: {
    color: "#fcd34d",
    fontSize: 14,
    fontWeight: "600",
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
