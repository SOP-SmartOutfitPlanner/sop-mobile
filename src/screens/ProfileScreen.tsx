import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/auth";
import { SafeAreaView } from "react-native-safe-area-context";

interface OutfitItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: any;
  status?: string;
}

const ProfileScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<
    "Outfits" | "Challenges" | "About"
  >("Outfits");
  const { logout, user } = useAuth();

  const outfits: OutfitItem[] = [
    {
      id: "1",
      title: "Summer Casual",
      category: "Casual",
      tags: ["Casual", "Summer", "Sustainable"],
      image: require("../../assets/adaptive-icon.png"),
      status: "Winner",
    },
    {
      id: "2",
      title: "Office Chic",
      category: "Business",
      tags: ["Business", "Elegant", "Minimalist"],
      image: require("../../assets/adaptive-icon.png"),
      status: "Runner-up",
    },
    {
      id: "3",
      title: "Street Style",
      category: "Urban",
      tags: ["Urban", "Edgy", "Casual"],
      image: require("../../assets/adaptive-icon.png"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderOutfitCard = (outfit: OutfitItem) => (
    <View key={outfit.id} style={styles.outfitCard}>
      <Image source={outfit.image} style={styles.outfitImage} />
      <View style={styles.outfitInfo}>
        <View style={styles.outfitHeader}>
          <Text style={styles.outfitTitle}>{outfit.title}</Text>
          {outfit.status && (
            <View
              style={[
                styles.statusBadge,
                outfit.status === "Winner"
                  ? styles.winnerBadge
                  : styles.runnerUpBadge,
              ]}
            >
              <Text style={styles.statusText}>{outfit.status}</Text>
            </View>
          )}
        </View>
        <View style={styles.tagsContainer}>
          {outfit.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/adaptive-icon.png")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>Minh Nguyen</Text>
          <Text style={styles.userBio}>
            Fashion enthusiast & style curator. Passionate about sustainable
            fashion and timeless pieces.
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>856</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(["Outfits", "Challenges", "About"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === "Outfits" && (
            <View style={styles.outfitsContainer}>
              {outfits.map(renderOutfitCard)}
            </View>
          )}

          {activeTab === "Challenges" && (
            <View style={styles.challengesContainer}>
              <Text style={styles.emptyText}>No challenges yet</Text>
            </View>
          )}

          {activeTab === "About" && (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText}>
                Fashion enthusiast with 5 years of experience in sustainable
                styling. Loves creating timeless looks that combine comfort with
                elegance.
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E2E8F0",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 200,
  },
  outfitsContainer: {
    gap: 16,
  },
  outfitCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outfitImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F1F5F9",
  },
  outfitInfo: {
    flex: 1,
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerBadge: {
    backgroundColor: "#3B82F6",
  },
  runnerUpBadge: {
    backgroundColor: "#64748B",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  challengesContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  aboutContainer: {
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  aboutText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  logoutContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
});

export default ProfileScreen;
