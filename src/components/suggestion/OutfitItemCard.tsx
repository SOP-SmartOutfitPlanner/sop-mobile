import React, { useState } from "react";
import { View, Text, StyleSheet, ImageSourcePropType, Image, ActivityIndicator } from "react-native";
import { Image as RNImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import AIBadge from "./AIBadge";
import ColorDots from "./ColorDots";
import ItemBadges from "./ItemBadges";

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
  styles?: Style[];
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
  styles,
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
  const hasValidImageUrl = imageUrl && 
    typeof imageUrl === "string" && 
    imageUrl.trim() !== "" && 
    imageUrl !== "null" && 
    imageUrl !== "undefined" &&
    (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("file://"));
  
  // Log for debugging
  React.useEffect(() => {
    console.log(`[OutfitItemCard] Rendering item: ${name}`);
    console.log(`[OutfitItemCard] imageUrl: ${imageUrl}`);
    console.log(`[OutfitItemCard] hasValidImageUrl: ${hasValidImageUrl}`);
    setImageError(false);
    setImageLoading(true);
  }, [imageUrl, name, hasValidImageUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {showAIBadge && <AIBadge type="ai" confidence={aiConfidence} />}
        {showSuggestBadge && <AIBadge type="suggest" />}
        
        {hasValidImageUrl && !imageError ? (
          <View style={styles.imageWrapper}>
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
                console.log(`[OutfitItemCard] 🔄 Loading image for ${name}: ${imageUrl}`);
                setImageLoading(true);
              }}
              onLoad={() => {
                console.log(`[OutfitItemCard] ✅ Image loaded successfully for ${name}`);
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(error) => {
                console.error(`[OutfitItemCard] ❌ Image load error for ${name}:`, {
                  imageUrl,
                  error: error.nativeEvent?.error || error,
                });
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </View>
        ) : image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="shirt-outline" size={48} color="#94A3B8" />
            <Text style={styles.placeholderText}>No Image</Text>
            {imageUrl && (
              <Text style={styles.placeholderSubtext} numberOfLines={1}>
                {imageUrl.substring(0, 30)}...
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Name and Category */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          )}
        </View>

        {/* Color Dots */}
        {colors.length > 0 && <ColorDots colors={colors} />}

        {/* Badges */}
        <ItemBadges
          fabric={fabric}
          weatherSuitable={weatherSuitable}
          seasons={seasons}
          styles={styles}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    minHeight: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#374151",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
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
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  placeholderSubtext: {
    marginTop: 4,
    fontSize: 9,
    color: "#64748B",
    fontWeight: "400",
  },
  content: {
    flex: 1,
    minHeight: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  categoryBadge: {
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#CBD5E1",
  },
});

export default OutfitItemCard;

