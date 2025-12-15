import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Text,
  PanResponder,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import OutfitItemCard from "./OutfitItemCard";
import MatchBadges from "./MatchBadges";
import ActionButtons from "./ActionButtons";
import PaginationDots from "./PaginationDots";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OutfitItemData {
  id: number;
  name: string;
  imageUrl?: string;
  image?: ImageSourcePropType;
  categoryName?: string;
  color?: string;
  fabric?: string;
  weatherSuitable?: string;
  seasons?: Array<{ id: number; name: string }>;
  styles?: Array<{ id: number; name: string }>;
  isAnalyzed?: boolean;
  aiConfidence?: number;
  itemType?: string;
}

interface MainSuggestionCardProps {
  items: OutfitItemData[];
  currentIndex: number;
  totalSuggestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onShare: () => void;
  onUseToday?: () => void;
  isSaving?: boolean;
  isUsingToday?: boolean;
  reason?: string;
}

// Helper to parse color from JSON string
const parseColor = (
  colorStr?: string
): Array<{ hex: string; name: string }> => {
  if (!colorStr) return [];
  try {
    const colors = JSON.parse(colorStr);
    if (Array.isArray(colors) && colors.length > 0) {
      return colors.map((c: any) => ({
        hex: c.hex || c,
        name: c.name || c,
      }));
    }
  } catch {
    return [{ hex: colorStr, name: colorStr }];
  }
  return [];
};

// Get season gradient colors
const getSeasonGradient = (seasonName: string): [string, string] => {
  const s = seasonName.toLowerCase();
  if (s === "spring") return ["#EC4899", "#F472B6"];
  if (s === "summer") return ["#F59E0B", "#FBBF24"];
  if (s === "fall" || s === "autumn") return ["#EA580C", "#F97316"];
  if (s === "winter") return ["#0EA5E9", "#38BDF8"];
  return ["#8B5CF6", "#A78BFA"];
};

const MainSuggestionCard: React.FC<MainSuggestionCardProps> = ({
  items,
  currentIndex,
  totalSuggestions,
  onPrevious,
  onNext,
  onSave,
  onShare,
  onUseToday,
  isSaving = false,
  isUsingToday = false,
  reason,
}) => {
  // Calculate match percentage (using AI confidence if available)
  const matchPercentage =
    items.length > 0 && items[0].aiConfidence
      ? Math.round(items[0].aiConfidence * 1)
      : 92;

  // Expand/collapse state for AI Recommendation
  const [isExpanded, setIsExpanded] = useState(false);

  // Item detail modal state
  const [selectedItem, setSelectedItem] = useState<OutfitItemData | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const handleItemPress = (item: OutfitItemData) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => totalSuggestions > 1,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe
        const { dx } = gestureState;

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0) {
            // Swipe right - go to previous
            onPrevious();
          } else {
            // Swipe left - go to next
            onNext();
          }
        }
      },
    })
  ).current;

  return (
    <View style={styles.card}>
      {/* Option Header with Badges */}
      <View style={styles.optionHeader}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Option {currentIndex + 1}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.matchBadge}>
              <Ionicons name="star" size={14} color="#FCD34D" />
              <Text style={styles.matchBadgeText}>{matchPercentage}%</Text>
            </View>
            <View style={styles.aiCuratedBadge}>
              <Text style={styles.aiCuratedText}>AI Curated</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Match Badges - Moved to top to avoid clipping */}
      {/* <MatchBadges
        matchPercentage={matchPercentage}
        style="AI Suggested"
        weather="Weather-ready"
      /> */}

      {reason && (
        <TouchableOpacity
          style={styles.reasonContainer}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              "rgba(139, 92, 246, 0.4)",
              "rgba(168, 85, 247, 0.3)",
              "rgba(139, 92, 246, 0.4)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reasonGradient}
          >
            <View style={styles.reasonHeader}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <View style={styles.reasonHeaderLeft}>
                <Text
                  style={styles.reasonTitle}
                  numberOfLines={isExpanded ? 0 : 1}
                >
                  {isExpanded
                    ? reason
                    : reason.length > 60
                    ? `${reason.substring(0, 60)}...`
                    : reason}
                </Text>
              </View>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#FFFFFF"
              />
            </View>
            {/* {isExpanded && (
              <Text style={styles.reasonText}>{reason}</Text>
            )} */}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Outfit Items - Grid 2x2 with Swipe Gesture */}
      <View style={styles.itemsContainer} {...panResponder.panHandlers}>
        <View style={styles.itemsGrid}>
          {items.map((item, index) => (
            <View key={item.id || index} style={styles.gridItem}>
              <OutfitItemCard
                id={item.id}
                name={item.name}
                image={item.image}
                imageUrl={item.imageUrl}
                categoryName={item.categoryName}
                color={item.color}
                fabric={item.fabric}
                weatherSuitable={item.weatherSuitable}
                seasons={item.seasons}
                itemStyles={item.styles}
                isAnalyzed={item.isAnalyzed}
                aiConfidence={item.aiConfidence}
                itemType={item.itemType}
                onPress={() => handleItemPress(item)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Pagination Dots */}
      {totalSuggestions > 1 && (
        <PaginationDots total={totalSuggestions} currentIndex={currentIndex} />
      )}

      <ActionButtons
        onSave={onSave}
        onShare={onShare}
        onUseToday={onUseToday}
        isSaving={isSaving}
        isUsingToday={isUsingToday}
      />

      {/* Item Detail Modal */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
            </View>

            {selectedItem && (
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* Item Image with Gradient Background */}
                <LinearGradient
                  colors={["#0F172A", "#1E293B", "#0F172A"]}
                  style={styles.modalImageContainer}
                >
                  {selectedItem.imageUrl ? (
                    <Image
                      source={{ uri: selectedItem.imageUrl }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.modalImagePlaceholder}>
                      <Ionicons
                        name="shirt-outline"
                        size={80}
                        color="#64748B"
                      />
                    </View>
                  )}

                  {/* AI Badge on image */}
                  {selectedItem.isAnalyzed && (
                    <LinearGradient
                      colors={["#8B5CF6", "#A855F7"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.modalAIBadge}
                    >
                      <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                      <Text style={styles.modalAIBadgeText}>AI Analyzed</Text>
                    </LinearGradient>
                  )}

                  {/* Close button overlay */}
                  <TouchableOpacity
                    style={styles.modalCloseBtnOverlay}
                    onPress={() => setShowItemModal(false)}
                  >
                    <Ionicons name="close" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </LinearGradient>

                {/* Item Info */}
                <View style={styles.modalInfo}>
                  {/* Header: Name & Category */}
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalItemName}>
                      {selectedItem.name}
                    </Text>
                    {selectedItem.categoryName && (
                      <View style={styles.modalCategoryBadge}>
                        <Ionicons name="pricetag" size={12} color="#64748B" />
                        <Text style={styles.modalCategory}>
                          {selectedItem.categoryName}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalDivider} />

                  {/* Color Section */}
                  {selectedItem.color &&
                    parseColor(selectedItem.color).length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Colors</Text>
                        <View style={styles.modalColorsRow}>
                          {parseColor(selectedItem.color).map((c, idx) => (
                            <View key={idx} style={styles.modalColorItem}>
                              <View
                                style={[
                                  styles.modalColorDot,
                                  { backgroundColor: c.hex },
                                ]}
                              />
                              <Text style={styles.modalColorName}>
                                {c.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                  {/* Details Grid */}
                  <View style={styles.modalDetailsGrid}>
                    {selectedItem.fabric && (
                      <LinearGradient
                        colors={[
                          "rgba(6, 182, 212, 0.15)",
                          "rgba(6, 182, 212, 0.05)",
                        ]}
                        style={styles.modalDetailItem}
                      >
                        <View style={styles.modalDetailIcon}>
                          <Ionicons
                            name="layers-outline"
                            size={20}
                            color="#06B6D4"
                          />
                        </View>
                        <Text style={styles.modalDetailLabel}>Fabric</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedItem.fabric}
                        </Text>
                      </LinearGradient>
                    )}
                    {selectedItem.weatherSuitable && (
                      <LinearGradient
                        colors={[
                          "rgba(245, 158, 11, 0.15)",
                          "rgba(245, 158, 11, 0.05)",
                        ]}
                        style={styles.modalDetailItem}
                      >
                        <View style={styles.modalDetailIcon}>
                          <Ionicons
                            name="partly-sunny-outline"
                            size={20}
                            color="#F59E0B"
                          />
                        </View>
                        <Text style={styles.modalDetailLabel}>Weather</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedItem.weatherSuitable}
                        </Text>
                      </LinearGradient>
                    )}
                    {selectedItem.aiConfidence && (
                      <LinearGradient
                        colors={[
                          "rgba(139, 92, 246, 0.15)",
                          "rgba(139, 92, 246, 0.05)",
                        ]}
                        style={styles.modalDetailItem}
                      >
                        <View style={styles.modalDetailIcon}>
                          <Ionicons
                            name="analytics-outline"
                            size={20}
                            color="#8B5CF6"
                          />
                        </View>
                        <Text style={styles.modalDetailLabel}>
                          AI Confidence
                        </Text>
                        <Text
                          style={[
                            styles.modalDetailValue,
                            { color: "#A78BFA" },
                          ]}
                        >
                          {selectedItem.aiConfidence}%
                        </Text>
                      </LinearGradient>
                    )}
                  </View>

                  {/* Seasons */}
                  {selectedItem.seasons && selectedItem.seasons.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Seasons</Text>
                      <View style={styles.modalBadgesRow}>
                        {selectedItem.seasons.map((season) => {
                          const gradientColors = getSeasonGradient(season.name);
                          return (
                            <LinearGradient
                              key={season.id}
                              colors={gradientColors}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.modalSeasonBadge}
                            >
                              <Text style={styles.modalSeasonText}>
                                {season.name}
                              </Text>
                            </LinearGradient>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Styles */}
                  {selectedItem.styles && selectedItem.styles.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Styles</Text>
                      <View style={styles.modalBadgesRow}>
                        {selectedItem.styles.map((style) => (
                          <View key={style.id} style={styles.modalStyleBadge}>
                            <Text style={styles.modalStyleText}>
                              {style.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  optionHeader: {
    marginBottom: 12,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  aiCuratedBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  aiCuratedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A78BFA",
  },
  itemsContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  itemsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 8,
  },
  reasonContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
  },
  reasonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  reasonHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  reasonTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0,
    flex: 1,
  },
  reasonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
    letterSpacing: 0,
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  modalCloseBtn: {
    position: "absolute",
    right: 16,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseBtnOverlay: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalContent: {
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingBottom: 50,
  },
  modalImageContainer: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "85%",
    height: "85%",
  },
  modalImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
  },
  modalAIBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 92, 246, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalAIBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalInfo: {
    gap: 20,
  },
  modalHeaderInfo: {
    gap: 8,
  },
  modalItemName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  modalCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  modalSection: {
    gap: 10,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalColorsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  modalColorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  modalColorName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  modalDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalDetailItem: {
    flex: 1,
    minWidth: "30%",
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalDetailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalDetailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDetailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  modalBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalSeasonBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalSeasonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalStyleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  modalStyleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C4B5FD",
    textTransform: "capitalize",
  },
});

export default MainSuggestionCard;
