import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OutfitCardProps {
  id: string;
  title: string;
  image: ImageSourcePropType;
  tags: string[];
  isFavorite?: boolean;
  onPressFavorite?: () => void;
  onPressMenu?: () => void;
  onPressUseToday?: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  title,
  image,
  tags,
  isFavorite = true,
  onPressFavorite,
  onPressMenu,
  onPressUseToday,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Image */}
        <Image source={image} style={styles.image} />

        {/* Menu & Favorite Icons */}
        <TouchableOpacity style={styles.menuButton} onPress={onPressMenu}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onPressFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#EF4444" : "#64748B"}
          />
        </TouchableOpacity>

        {/* Content Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Use Today Button */}
          <TouchableOpacity
            style={styles.useTodayButton}
            onPress={onPressUseToday}
          >
            <Ionicons
              name="play"
              size={16}
              color="#1E293B"
              style={styles.playIcon}
            />
            <Text style={styles.useTodayText}>Use Today</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  menuButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  useTodayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  playIcon: {
    marginRight: -4,
  },
  useTodayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
});

export default OutfitCard;
