import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Outfit } from "../../types/outfit";
import AnimatedBackground from "../common/AnimatedBackground";

type ColorInfo = {
  name?: string;
  hex?: string;
};

const parseColorInfo = (color?: string | null): ColorInfo[] => {
  if (!color) {
    return [];
  }

  try {
    const parsed = JSON.parse(color);
    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => {
          if (typeof entry !== "object" || entry === null) {
            return null;
          }
          const castEntry = entry as { name?: unknown; hex?: unknown };
          const name = typeof castEntry.name === "string" ? castEntry.name : undefined;
          const hex = typeof castEntry.hex === "string" ? castEntry.hex : undefined;
          if (name || hex) {
            return { name, hex } as ColorInfo;
          }
          return null;
        })
        .filter((entry): entry is ColorInfo => entry !== null);
    }
  } catch (error) {
    // Fallback to plain string when JSON.parse fails
  }

  return [{ name: color }];
};

interface OutfitDetailModalProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
  onToggleFavorite: (outfitId: number) => void;
  onDeleteOutfit: (outfitId: number) => Promise<void> | void;
  onEditOutfit: (outfitId: number) => void;
  onUseOutfitToday?: (outfitId: number) => void;
}

export const OutfitDetailModal: React.FC<OutfitDetailModalProps> = ({
  visible,
  outfit,
  onClose,
  onToggleFavorite,
  onDeleteOutfit,
  onEditOutfit,
  onUseOutfitToday,
}) => {
  if (!outfit) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleFavoritePress = () => {
    onToggleFavorite(outfit.id);
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete outfit",
      "Are you sure you want to delete this outfit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteOutfit(outfit.id),
        },
      ]
    );
  };

  const handleEditPress = () => {
    onEditOutfit(outfit.id);
  };

  const handleUseOutfitToday = () => {
    if (onUseOutfitToday) {
      onUseOutfitToday(outfit.id);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <AnimatedBackground />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <LinearGradient
            colors={["rgba(31, 43, 136, 0.95)", "rgba(14, 19, 58, 0.9)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
          <View style={styles.heroHeader}>
            <View style={styles.heroTextWrapper}>
              <Text style={styles.heroTitle}>{outfit.name}</Text>
              <Text style={styles.heroSubtitle} numberOfLines={2} ellipsizeMode="tail">
                {outfit.description?.trim() || "Plan your day with confidence"}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="person-outline" size={14} color="#bbcbff" />
              <Text style={styles.heroBadgeText}>
                {outfit.userDisplayName || "Unknown creator"}
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="calendar-outline" size={14} color="#bbcbff" />
              <Text style={styles.heroBadgeText}>{formatDate(outfit.createdDate)}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
            <View style={styles.statusRow}>
              <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Favorite</Text>
                <View style={styles.statusValueRow}>
                  <Ionicons
                    name={outfit.isFavorite ? "heart" : "heart-outline"}
                    size={16}
                    color={outfit.isFavorite ? "#f87171" : "#94a3b8"}
                  />
                  <Text
                    style={[
                      styles.statusValue,
                      { color: outfit.isFavorite ? "#f87171" : "#475569" },
                    ]}
                  >
                    {outfit.isFavorite ? "Marked" : "Not added"}
                  </Text>
                </View>
              </View>
              <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Saved</Text>
                <View style={styles.statusValueRow}>
                  <Ionicons
                    name={outfit.isSaved ? "bookmark" : "bookmark-outline"}
                    size={16}
                    color={outfit.isSaved ? "#38bdf8" : "#94a3b8"}
                  />
                  <Text
                    style={[
                      styles.statusValue,
                      { color: outfit.isSaved ? "#0ea5e9" : "#475569" },
                    ]}
                  >
                    {outfit.isSaved ? "Saved" : "Not saved"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Item list</Text>
                <Text style={styles.sectionSubtitle}>
                  {outfit.items.length} curated items for this outfit
                </Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={14} color="#1d4ed8" />
                <Text style={styles.badgeText}>
                  Last updated {formatDate(outfit.updatedDate || outfit.createdDate)}
                </Text>
              </View>
            </View>

            <View style={styles.itemsGrid}>
              {outfit.items.map((item) => {
                const colors = parseColorInfo(item.color);
                return (
                  <View key={item.itemId} style={styles.itemCard}>
                    <View style={styles.itemThumbnail}>
                      {item.imgUrl ? (
                        <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
                      ) : (
                        <Ionicons name="shirt-outline" size={26} color="#94a3b8" />
                      )}
                    </View>
                    <View style={styles.itemInfo}>
                      <View style={styles.itemTitleRow}>
                        <Text numberOfLines={1} style={styles.itemName}>
                          {item.name}
                        </Text>
                        {item.brand && (
                          <View style={styles.itemPill}>
                            <Text style={styles.itemPillText}>{item.brand}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemMeta}>{item.categoryName}</Text>
                      {colors.length > 0 && (
                        <View style={styles.colorRow}>
                          {colors.map((colorInfo, index) => (
                            <View key={`${item.itemId}-color-${index}`} style={styles.colorBadge}>
                              {colorInfo.hex && (
                                <View
                                  style={[
                                    styles.colorSwatch,
                                    { backgroundColor: colorInfo.hex },
                                  ]}
                                />
                              )}
                              <Text numberOfLines={1} style={styles.colorText}>
                                {colorInfo.name || colorInfo.hex}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
        </ScrollView>

        <View style={styles.actionsContainer}>
          {/* Primary CTA */}
          {onUseOutfitToday && (
            <TouchableOpacity
              style={styles.useTodayButton}
              onPress={handleUseOutfitToday}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.useTodayButtonText}>Use Outfit Today</Text>
            </TouchableOpacity>
          )}

          {/* Secondary Actions Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                outfit.isFavorite && styles.favoriteButtonActive
              ]}
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={outfit.isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={outfit.isFavorite ? "#f87171" : "#e2e8f0"}
              />
              <Text style={[
                styles.favoriteButtonText,
                outfit.isFavorite && styles.favoriteButtonTextActive
              ]}>
                {outfit.isFavorite ? "Favorited" : "Favorite"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Ionicons name="create-outline" size={18} color="#60a5fa" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={18} color="#f87171" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030617",
  },
  safeArea: {
    flex: 1,
  },
  hero: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  heroTextWrapper: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
  },
  heroSubtitle: {
    marginTop: 6,
    color: "rgba(226, 232, 240, 0.9)",
    fontSize: 14,
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    flexWrap: "wrap",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  heroBadgeText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "500",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 160,
  },
  statusRow: {
    flexDirection: "row",
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  statusLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
  },
  statusValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    flexShrink: 1,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#60a5fa",
    fontWeight: "600",
  },
  itemsGrid: {
    gap: 14,
  },
  itemCard: {
    flexDirection: "row",
    gap: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 2,
  },
  itemThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(51, 65, 85, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
    flex: 1,
  },
  itemMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },
  itemMetaMuted: {
    fontSize: 12,
    color: "#64748b",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  colorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(51, 65, 85, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  colorText: {
    fontSize: 12,
    color: "#e2e8f0",
    fontWeight: "600",
    maxWidth: 120,
  },
  itemPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  itemPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a5b4fc",
  },
  actionsContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.15)",
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  useTodayButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  useTodayButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  favoriteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
  },
  favoriteButtonActive: {
    borderColor: "rgba(248, 113, 113, 0.4)",
    backgroundColor: "rgba(248, 113, 113, 0.15)",
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  favoriteButtonTextActive: {
    color: "#f87171",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.3)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60a5fa",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f87171",
  },
});

