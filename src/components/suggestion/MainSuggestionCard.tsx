import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import SuggestionCarousel from "./SuggestionCarousel";
import OutfitItem from "./OutfitItem";
import MatchBadges from "./MatchBadges";
import ActionButtons from "./ActionButtons";

interface OutfitItemData {
  name: string;
  image: ImageSourcePropType;
}

interface MainSuggestionCardProps {
  items: OutfitItemData[];
  mainImage: ImageSourcePropType;
  matchPercentage: number;
  style: string;
  weather: string;
  currentIndex: number;
  totalSuggestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onShare: () => void;
}

const MainSuggestionCard: React.FC<MainSuggestionCardProps> = ({
  items,
  mainImage,
  matchPercentage,
  style,
  weather,
  currentIndex,
  totalSuggestions,
  onPrevious,
  onNext,
  onSave,
  onShare,
}) => {
  return (
    <View style={styles.card}>
      <SuggestionCarousel
        currentIndex={currentIndex}
        totalItems={totalSuggestions}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <View style={styles.outfitItemsRow}>
        {items.map((item, index) => (
          <OutfitItem key={index} name={item.name} image={item.image} />
        ))}
      </View>

      <View style={styles.centerImageContainer}>
        <Image source={mainImage} style={styles.centerImage} />
      </View>

      <MatchBadges
        matchPercentage={matchPercentage}
        style={style}
        weather={weather}
      />

      <ActionButtons onSave={onSave} onShare={onShare} />
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
});

export default MainSuggestionCard;
