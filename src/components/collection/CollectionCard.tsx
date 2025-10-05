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

interface CollectionCardProps {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  tags: string[];
  author: string;
  views: number;
  likes: number;
  items: number;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  description,
  image,
  tags,
  author,
  views,
  likes,
  items,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>
        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.authorContainer}>
            <Ionicons name="person-circle-outline" size={16} color="#FFFFFF" />
            <Text style={styles.authorText}>{author}</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
              <Text style={styles.statText}>{views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={14} color="#FFFFFF" />
              <Text style={styles.statText}>{likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="layers-outline" size={14} color="#FFFFFF" />
              <Text style={styles.statText}>{items}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#E2E8F0",
    fontWeight: "400",
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  tagText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default CollectionCard;
