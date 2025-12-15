import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  onPress?: () => void;
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
  onPress,
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

  // Get season gradient colors
  const getSeasonGradient = (seasonName: string): [string, string] => {
    const s = seasonName.toLowerCase();
    if (s === "spring") return ["#EC4899", "#F472B6"];
    if (s === "summer") return ["#F59E0B", "#FBBF24"];
    if (s === "fall" || s === "autumn") return ["#EA580C", "#F97316"];
    if (s === "winter") return ["#0EA5E9", "#38BDF8"];
    return ["#8B5CF6", "#A78BFA"];
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        {showAIBadge && <AIBadge type="ai" confidence={aiConfidence} />}
        {/* {showSuggestBadge && <AIBadge type="suggest" type="ai"  />} */}
        {showSuggestBadge && <AIBadge type="ai" />}
        
        {/* Expand indicator */}
        {onPress && (
          <View style={styles.expandIndicator}>
            <Ionicons name="expand-outline" size={14} color="#FFFFFF" />
          </View>
        )}

        {hasValidImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <View>
                {/* <ActivityIndicator size="small" color="#3B82F6" /> */}
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

        {/* Season & Style Badges */}
        <View style={styles.badgesContainer}>
          {/* Season Badges */}
          {seasons && seasons.length > 0 && (
            <View style={styles.badgesRow}>
              {seasons.slice(0, 2).map((season) => {
                const gradientColors = getSeasonGradient(season.name);
                return (
                  <LinearGradient
                    key={season.id}
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.seasonBadge}
                  >
                    <Text style={styles.seasonText}>{season.name}</Text>
                  </LinearGradient>
                );
              })}
            </View>
          )}
          
          {/* Style Badges */}
          {itemStyles && itemStyles.length > 0 && (
            <View style={styles.badgesRow}>
              {itemStyles.slice(0, 1).map((style) => (
                <View key={style.id} style={styles.styleBadge}>
                  <Text style={styles.styleText}>{style.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.2)",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    minHeight: 100,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#374151",
    marginBottom: 8,
  },
  expandIndicator: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    padding: 4,
    backdropFilter: "blur(4px)",
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
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 18,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: 6,
  },
  badgesContainer: {
    gap: 4,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  seasonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seasonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  styleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  styleText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#C4B5FD",
    textTransform: "capitalize",
  },
});

export default OutfitItemCard;
