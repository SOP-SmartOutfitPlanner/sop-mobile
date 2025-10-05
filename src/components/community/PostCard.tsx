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

interface PostCardProps {
  id: string;
  authorName: string;
  authorAvatar: ImageSourcePropType;
  authorBadge?: string;
  timeAgo: string;
  outfitImages: ImageSourcePropType[];
  description: string;
  hashtags: string[];
  likes: number;
  comments: number;
  onLikePress: () => void;
  onCommentPress: () => void;
  onSharePress: () => void;
  onMessagePress: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  authorName,
  authorAvatar,
  authorBadge,
  timeAgo,
  outfitImages,
  description,
  hashtags,
  likes,
  comments,
  onLikePress,
  onCommentPress,
  onSharePress,
  onMessagePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image source={authorAvatar} style={styles.avatar} />
          <View style={styles.authorTextContainer}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{authorName}</Text>
              {authorBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{authorBadge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
          <Ionicons name="chatbubble-outline" size={18} color="#6366F1" />
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Outfit Images */}
      <View style={styles.imagesContainer}>
        {outfitImages.map((image, index) => (
          <Image key={index} source={image} style={styles.outfitImage} />
        ))}
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Hashtags */}
      <View style={styles.hashtagsContainer}>
        {hashtags.map((tag, index) => (
          <TouchableOpacity key={index} style={styles.hashtag}>
            <Text style={styles.hashtagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
          <Ionicons name="heart-outline" size={20} color="#64748B" />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
          <Ionicons name="share-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorTextContainer: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
  },
  timeAgo: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366F1",
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  outfitImage: {
    flex: 1,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  description: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  hashtag: {
    paddingHorizontal: 0,
  },
  hashtagText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default PostCard;
