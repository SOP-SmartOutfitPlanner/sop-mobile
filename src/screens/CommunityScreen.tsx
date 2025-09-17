import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const CommunityScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cộng Đồng</Text>
        <Text style={styles.subtitle}>
          Kết nối với những người yêu thời trang
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Xu Hướng Hôm Nay</Text>
          <View style={styles.trendingTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#MinimalStyle</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#AutumnFashion</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#BusinessCasual</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#StreetStyle</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outfit Nổi Bật</Text>
          <View style={styles.featuredOutfits}>
            <View style={styles.outfitPost}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👩</Text>
                  </View>
                  <View>
                    <Text style={styles.username}>@fashionista_maya</Text>
                    <Text style={styles.postTime}>2 giờ trước</Text>
                  </View>
                </View>
                <Text style={styles.followButton}>Theo dõi</Text>
              </View>

              <View style={styles.outfitImage}>
                <Text style={styles.outfitEmoji}>👗✨</Text>
                <Text style={styles.outfitDesc}>Summer Evening Look</Text>
              </View>

              <View style={styles.postActions}>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>❤️</Text>
                  <Text style={styles.actionText}>234</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>💬</Text>
                  <Text style={styles.actionText}>45</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🔄</Text>
                  <Text style={styles.actionText}>12</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>📌</Text>
                  <Text style={styles.actionText}>Lưu</Text>
                </View>
              </View>
            </View>

            <View style={styles.outfitPost}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👨</Text>
                  </View>
                  <View>
                    <Text style={styles.username}>@dapper_daniel</Text>
                    <Text style={styles.postTime}>4 giờ trước</Text>
                  </View>
                </View>
                <Text style={styles.followButton}>Theo dõi</Text>
              </View>

              <View style={styles.outfitImage}>
                <Text style={styles.outfitEmoji}>🤵‍♂️💼</Text>
                <Text style={styles.outfitDesc}>Monday Motivation</Text>
              </View>

              <View style={styles.postActions}>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>❤️</Text>
                  <Text style={styles.actionText}>189</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>💬</Text>
                  <Text style={styles.actionText}>23</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🔄</Text>
                  <Text style={styles.actionText}>8</Text>
                </View>
                <View style={styles.actionButton}>
                  <Text style={styles.actionIcon}>📌</Text>
                  <Text style={styles.actionText}>Lưu</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thảo Luận</Text>
          <View style={styles.discussions}>
            <View style={styles.discussionItem}>
              <Text style={styles.discussionTitle}>
                💡 Tips mix & match màu sắc cho mùa thu
              </Text>
              <Text style={styles.discussionMeta}>
                156 bình luận • 2.3k lượt xem
              </Text>
            </View>

            <View style={styles.discussionItem}>
              <Text style={styles.discussionTitle}>
                🛍️ Review các brand thời trang bình dân
              </Text>
              <Text style={styles.discussionMeta}>
                89 bình luận • 1.8k lượt xem
              </Text>
            </View>

            <View style={styles.discussionItem}>
              <Text style={styles.discussionTitle}>
                ✨ Cách chọn outfit đi phỏng vấn xin việc
              </Text>
              <Text style={styles.discussionMeta}>
                203 bình luận • 4.1k lượt xem
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người Theo Dõi Hàng Đầu</Text>
          <View style={styles.topFollowers}>
            <View style={styles.followerCard}>
              <View style={styles.followerAvatar}>
                <Text style={styles.followerEmoji}>👸</Text>
              </View>
              <Text style={styles.followerName}>Style Queen</Text>
              <Text style={styles.followerCount}>125k followers</Text>
            </View>

            <View style={styles.followerCard}>
              <View style={styles.followerAvatar}>
                <Text style={styles.followerEmoji}>🕴️</Text>
              </View>
              <Text style={styles.followerName}>Gentleman</Text>
              <Text style={styles.followerCount}>89k followers</Text>
            </View>

            <View style={styles.followerCard}>
              <View style={styles.followerAvatar}>
                <Text style={styles.followerEmoji}>🌟</Text>
              </View>
              <Text style={styles.followerName}>Fashion Guru</Text>
              <Text style={styles.followerCount}>201k followers</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#6f42c1",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  trendingTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#6f42c1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  featuredOutfits: {
    gap: 16,
  },
  outfitPost: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  followButton: {
    fontSize: 14,
    color: "#6f42c1",
    fontWeight: "600",
  },
  outfitImage: {
    height: 120,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  outfitEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  outfitDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f3f4",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  discussions: {
    gap: 12,
  },
  discussionItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  discussionMeta: {
    fontSize: 14,
    color: "#666",
  },
  topFollowers: {
    flexDirection: "row",
    gap: 12,
  },
  followerCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  followerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  followerEmoji: {
    fontSize: 24,
  },
  followerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  followerCount: {
    fontSize: 12,
    color: "#666",
  },
});

export default CommunityScreen;
