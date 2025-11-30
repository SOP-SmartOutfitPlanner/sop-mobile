import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
} from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import AIBadge from "./AIBadge";
import ColorDots from "./ColorDots";

interface Season {
  id: number;
  name: string;
}

interface Style {
  id: number;
  name: string;
}

interface Color {
  hex: string;
  name: string;
}

interface OutfitItemCardProps {
  id: number;
  name: string;
  image?: ImageSourcePropType;
  imageUrl?: string;
  categoryName?: string;
  color?: string;
  fabric?: string;
  weatherSuitable?: string;
  seasons?: Season[];
  itemStyles?: Style[];
  isAnalyzed?: boolean;
  aiConfidence?: number;
  itemType?: string;
}

const OutfitItemCard: React.FC<OutfitItemCardProps> = ({
  id,
  name,
  image,
  imageUrl,
  categoryName,
  color,
  fabric,
  weatherSuitable,
  seasons,
  itemStyles,
  isAnalyzed,
  aiConfidence,
  itemType,
}) => {
  // Parse color from JSON string
  const parseColor = (colorStr?: string): Color[] => {
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
      // If not JSON, try to parse as single color
      return [{ hex: colorStr, name: colorStr }];
    }
    return [];
  };

  const colors = parseColor(color);
  const showAIBadge = isAnalyzed && aiConfidence;
  const showSuggestBadge = itemType === "SYSTEM";
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Validate imageUrl
  const hasValidImageUrl =
    imageUrl &&
    typeof imageUrl === "string" &&
    imageUrl.trim() !== "" &&
    imageUrl !== "null" &&
    imageUrl !== "undefined" &&
    (imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("file://"));

  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [imageUrl, name, hasValidImageUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {showAIBadge && <AIBadge type="ai" confidence={aiConfidence} />}
        {/* {showSuggestBadge && <AIBadge type="suggest" />} */}

        {hasValidImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => {
                setImageLoading(true);
              }}
              onLoad={() => {
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(error) => {
                console.error(
                  `[OutfitItemCard] ❌ Image load error for ${name}:`,
                  {
                    imageUrl,
                    error: error.nativeEvent?.error || error,
                  }
                );
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </>
        ) : image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="shirt-outline" size={48} color="#94A3B8" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        {/* Category */}
        {categoryName && (
          <Text style={styles.categoryText}>{categoryName}</Text>
        )}

        {/* Color Dots */}
        {colors.length > 0 && <ColorDots colors={colors} />}

        {/* Season Badge Only */}
        {seasons && seasons.length > 0 && (
          <View style={styles.seasonContainer}>
            {seasons.slice(0, 1).map((season) => {
              const getSeasonColor = (seasonName: string) => {
                const s = seasonName.toLowerCase();
                if (s === "spring") return "#EC4899";
                if (s === "summer") return "#FCD34D";
                if (s === "fall" || s === "autumn") return "#F97316";
                if (s === "winter") return "#06B6D4";
                return "#EC4899";
              };
              const bgColor = getSeasonColor(season.name);
              return (
                <View
                  key={season.id}
                  style={[styles.seasonBadge, { backgroundColor: bgColor }]}
                >
                  <Text style={styles.seasonText}>{season.name}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    minHeight: 120,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#374151",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#374151",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  content: {
    gap: 3,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 16,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#CBD5E1",
    marginBottom: 4,
  },
  seasonContainer: {
    marginTop: 2,
  },
  seasonBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  seasonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
});

export default OutfitItemCard;
