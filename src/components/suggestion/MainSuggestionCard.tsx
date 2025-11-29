import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType, Text } from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import SuggestionCarousel from "./SuggestionCarousel";
import OutfitItem from "./OutfitItem";
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
  // Get current item based on index
  const currentItem = items[currentIndex] || items[0];
  const displayItems = items.slice(0, 3); // Show first 3 items

  return (
    <View style={styles.card}>
      <SuggestionCarousel
        currentIndex={currentIndex}
        totalItems={totalSuggestions}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      {reason && (
        <View style={styles.reasonContainer}>
          <View style={styles.reasonHeader}>
            <Ionicons name="sparkles" size={16} color="#3B82F6" />
            <Text style={styles.reasonTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      )}

      <View style={styles.outfitItemsRow}>
        {displayItems.map((item, index) => (
          <OutfitItem
            key={item.id || index}
            name={item.name}
            image={item.image}
            imageUrl={item.imageUrl}
            categoryName={item.categoryName}
          />
        ))}
      </View>

      {currentItem && (
        <View style={styles.centerImageContainer}>
          {currentItem.imageUrl ? (
            <RNImage
              source={{ uri: currentItem.imageUrl }}
              style={styles.centerImage}
              contentFit="cover"
              transition={200}
            />
          ) : currentItem.image ? (
            <Image source={currentItem.image} style={styles.centerImage} />
          ) : (
            <View style={[styles.centerImage, styles.placeholderImage]} />
          )}
        </View>
      )}

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
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitItemsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  centerImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  centerImage: {
    width: 160,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  placeholderImage: {
    backgroundColor: "#E2E8F0",
  },
  reasonContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  reasonText: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
});

export default MainSuggestionCard;
