import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  MoreHorizontal,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react-native";
import { COMMUNITY_POST } from "../../constants/homeData";
import {
  COLORS,
  SPACING,
  SHADOWS,
  SIZES,
  BASE_STYLES,
} from "../../constants/homeStyles";

export const TrendingCommunity: React.FC = () => {
  return (
    <View style={[BASE_STYLES.cardBase, styles.container]}>
      <View style={styles.header}>
        <Text style={BASE_STYLES.titleBase}>Trending in Community</Text>
        <TouchableOpacity>
          <Text style={styles.exploreText}>Explore</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>
                {COMMUNITY_POST.user.initials}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{COMMUNITY_POST.user.name}</Text>
              <Text style={styles.timeAgo}>{COMMUNITY_POST.user.timeAgo}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={18} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.postContent}>{COMMUNITY_POST.content}</Text>

        <TouchableOpacity style={styles.postImageContainer}>
          <Image
            source={{ uri: COMMUNITY_POST.imageUri }}
            style={styles.postImage}
          />
        </TouchableOpacity>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={16} color={COLORS.text.secondary} />
            <Text style={styles.actionText}>{COMMUNITY_POST.stats.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={16} color={COLORS.text.secondary} />
            <Text style={styles.actionText}>
              {COMMUNITY_POST.stats.comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <ExternalLink size={16} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  exploreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  postContainer: {
    backgroundColor: COLORS.white,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  userInitials: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  moreButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  postContent: {
    fontSize: 14,
    color: COLORS.text.primary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  postImageContainer: {
    marginBottom: SPACING.md,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: SPACING.md,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.lg,
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  shareButton: {
    marginLeft: "auto",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
