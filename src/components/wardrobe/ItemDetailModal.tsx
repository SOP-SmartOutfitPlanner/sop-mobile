import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WardrobeItem } from "../../types";

const { width, height } = Dimensions.get("window");

interface ItemDetailModalProps {
  visible: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
  onUseInOutfit: (item: WardrobeItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  onClose,
  item,
  onUseInOutfit,
}) => {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={item.isFavorite ? "#ff4757" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>

          {/* Basic Info */}
          <View style={styles.infoSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.brand && <Text style={styles.brand}>{item.brand}</Text>}

            <View style={styles.tagsContainer}>
              {(item.tags || []).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Wear Count</Text>
              <Text style={styles.statValue}>{item.wearCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>${item.price}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Last Worn</Text>
              <Text style={styles.statValue}>
                {new Date(item.lastWorn).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{item.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Color:</Text>
              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.detailValue}>{item.color}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seasons:</Text>
              <Text style={styles.detailValue}>
                {(item.seasons || []).join(", ") || "Not specified"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Occasions:</Text>
              <Text style={styles.detailValue}>
                {(item.occasions || []).join(", ") || "Not specified"}
              </Text>
            </View>

            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.outfitButton]}
            onPress={() => onUseInOutfit(item)}
          >
            <Ionicons name="shirt-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Use in Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
            <Ionicons name="pencil" size={20} color="#3b82f6" />
            <Text style={[styles.actionButtonText, { color: "#3b82f6" }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    maxHeight: height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoSection: {
    padding: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  detailsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    textTransform: "capitalize",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  notesContainer: {
    marginTop: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#1f2937",
    marginTop: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  outfitButton: {
    backgroundColor: "#3b82f6",
  },
  editButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
