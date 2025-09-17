import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const CollectionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bộ Sưu Tập</Text>
        <Text style={styles.subtitle}>Quản lý và sắp xếp outfit yêu thích</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Bộ sưu tập</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Outfit</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bộ Sưu Tập Của Tôi</Text>
            <Text style={styles.createButton}>+ Tạo mới</Text>
          </View>

          <View style={styles.collectionsGrid}>
            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>💼</Text>
              </View>
              <Text style={styles.collectionName}>Công Sở</Text>
              <Text style={styles.collectionCount}>24 outfit</Text>
              <Text style={styles.collectionDesc}>
                Trang phục chuyên nghiệp cho môi trường làm việc
              </Text>
            </View>

            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>🎉</Text>
              </View>
              <Text style={styles.collectionName}>Dự Tiệc</Text>
              <Text style={styles.collectionCount}>12 outfit</Text>
              <Text style={styles.collectionDesc}>
                Trang phục sang trọng cho các sự kiện đặc biệt
              </Text>
            </View>

            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>🏖️</Text>
              </View>
              <Text style={styles.collectionName}>Casual</Text>
              <Text style={styles.collectionCount}>35 outfit</Text>
              <Text style={styles.collectionDesc}>
                Trang phục thoải mái cho cuối tuần
              </Text>
            </View>

            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>🌟</Text>
              </View>
              <Text style={styles.collectionName}>Xu Hướng</Text>
              <Text style={styles.collectionCount}>18 outfit</Text>
              <Text style={styles.collectionDesc}>
                Những xu hướng thời trang mới nhất
              </Text>
            </View>

            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>🎂</Text>
              </View>
              <Text style={styles.collectionName}>Sinh Nhật</Text>
              <Text style={styles.collectionCount}>8 outfit</Text>
              <Text style={styles.collectionDesc}>
                Trang phục đặc biệt cho ngày sinh nhật
              </Text>
            </View>

            <View style={styles.collectionCard}>
              <View style={styles.collectionPreview}>
                <Text style={styles.previewEmoji}>❄️</Text>
              </View>
              <Text style={styles.collectionName}>Mùa Đông</Text>
              <Text style={styles.collectionCount}>22 outfit</Text>
              <Text style={styles.collectionDesc}>
                Trang phục ấm áp cho mùa đông
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outfit Được Yêu Thích</Text>
          <View style={styles.favoriteOutfits}>
            <View style={styles.favoriteItem}>
              <View style={styles.favoriteImage}>
                <Text style={styles.favoriteEmoji}>👔</Text>
              </View>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>Business Classic</Text>
                <Text style={styles.favoriteCollection}>Công Sở</Text>
                <Text style={styles.favoriteDate}>Yêu thích 2 ngày trước</Text>
              </View>
              <Text style={styles.favoriteHeart}>❤️</Text>
            </View>

            <View style={styles.favoriteItem}>
              <View style={styles.favoriteImage}>
                <Text style={styles.favoriteEmoji}>👗</Text>
              </View>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>Evening Elegance</Text>
                <Text style={styles.favoriteCollection}>Dự Tiệc</Text>
                <Text style={styles.favoriteDate}>Yêu thích 1 tuần trước</Text>
              </View>
              <Text style={styles.favoriteHeart}>❤️</Text>
            </View>

            <View style={styles.favoriteItem}>
              <View style={styles.favoriteImage}>
                <Text style={styles.favoriteEmoji}>👕</Text>
              </View>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>Weekend Chill</Text>
                <Text style={styles.favoriteCollection}>Casual</Text>
                <Text style={styles.favoriteDate}>Yêu thích 3 ngày trước</Text>
              </View>
              <Text style={styles.favoriteHeart}>❤️</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thẻ Tag</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Công sở</Text>
              <Text style={styles.tagCount}>24</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Casual</Text>
              <Text style={styles.tagCount}>35</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Dự tiệc</Text>
              <Text style={styles.tagCount}>12</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Mùa đông</Text>
              <Text style={styles.tagCount}>22</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Trendy</Text>
              <Text style={styles.tagCount}>18</Text>
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
    backgroundColor: "#fd7e14",
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
  statsBar: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fd7e14",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  createButton: {
    fontSize: 16,
    color: "#fd7e14",
    fontWeight: "600",
  },
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  collectionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionPreview: {
    height: 80,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  previewEmoji: {
    fontSize: 32,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 14,
    color: "#fd7e14",
    fontWeight: "600",
    marginBottom: 8,
  },
  collectionDesc: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  favoriteOutfits: {
    gap: 12,
  },
  favoriteItem: {
    flexDirection: "row",
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
  favoriteImage: {
    width: 50,
    height: 50,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  favoriteEmoji: {
    fontSize: 24,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  favoriteCollection: {
    fontSize: 14,
    color: "#fd7e14",
    marginBottom: 2,
  },
  favoriteDate: {
    fontSize: 12,
    color: "#666",
  },
  favoriteHeart: {
    fontSize: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginRight: 6,
  },
  tagCount: {
    fontSize: 12,
    color: "#fd7e14",
    fontWeight: "bold",
  },
});

export default CollectionScreen;
