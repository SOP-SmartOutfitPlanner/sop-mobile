import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Text,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import OutfitItemCard from "./OutfitItemCard";
import MatchBadges from "./MatchBadges";
import ActionButtons from "./ActionButtons";
import PaginationDots from "./PaginationDots";

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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
});

export default MainSuggestionCard;
