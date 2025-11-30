import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import OutfitItemCard from "./OutfitItemCard";
import MatchBadges from "./MatchBadges";
import ActionButtons from "./ActionButtons";

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
  const matchPercentage = items.length > 0 && items[0].aiConfidence
    ? Math.round(items[0].aiConfidence * 100)
    : 92;

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

      {reason && (
        <View style={styles.reasonContainer}>
          <LinearGradient
            colors={["rgba(139, 92, 246, 0.4)", "rgba(168, 85, 247, 0.3)", "rgba(139, 92, 246, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reasonGradient}
          >
            <View style={styles.reasonHeader}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.reasonTitle}>AI Recommendation</Text>
            </View>
            <Text style={styles.reasonText}>{reason}</Text>
          </LinearGradient>
        </View>
      )}

      {/* Outfit Items - Grid 2x2 */}
      <View style={styles.itemsContainer}>
        {totalSuggestions > 1 && (
          <TouchableOpacity
            style={styles.navArrow}
            onPress={onPrevious}
          >
            <Ionicons name="chevron-back" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        )}
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
                styles={item.styles}
                isAnalyzed={item.isAnalyzed}
                aiConfidence={item.aiConfidence}
                itemType={item.itemType}
              />
            </View>
        ))}
      </View>
        {totalSuggestions > 1 && (
          <TouchableOpacity
            style={styles.navArrow}
            onPress={onNext}
          >
            <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      </View>

      <MatchBadges
        matchPercentage={92}
        style="AI Suggested"
        weather="Weather-ready"
      />

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
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  optionHeader: {
    marginBottom: 20,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  aiCuratedBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  aiCuratedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C4B5FD",
  },
  itemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  navArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  itemsGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: {
    width: "48%",
    minWidth: 0,
  },
  reasonContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  reasonGradient: {
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  reasonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  reasonText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default MainSuggestionCard;
