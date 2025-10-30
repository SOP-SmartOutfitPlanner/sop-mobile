import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  CommunityStats,
  FeedTabs,
  PostCard,
} from "../components/community";

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<
    "Latest" | "Trending" | "Following"
  >("Latest");

  // Mock data
  const posts = [
    {
      id: "1",
      authorName: "Sarah Chen",
      authorAvatar: require("../../assets/adaptive-icon.png"),
      authorBadge: "Stylist",
      timeAgo: "6254 secs",
      outfitImages: [
        require("../../assets/adaptive-icon.png"),
        require("../../assets/adaptive-icon.png"),
        require("../../assets/adaptive-icon.png"),
      ],
      description: "Perfect smart casual look for today's meetings �",
      hashtags: ["#OOTD", "#SmartCasual", "#WorkStyle"],
      likes: 124,
      comments: 18,
    },
    {
      id: "2",
      authorName: "Sarah Xao",
      authorAvatar: require("../../assets/adaptive-icon.png"),
      authorBadge: "Stylist",
      timeAgo: "7254 secs",
      outfitImages: [
        require("../../assets/adaptive-icon.png"),
        require("../../assets/adaptive-icon.png"),
        require("../../assets/adaptive-icon.png"),
      ],
      description: "Perfect smart casual look for today's meetings �",
      hashtags: ["#OOTD", "#SmartCasual", "#WorkStyle"],
      likes: 114,
      comments: 18,
    },
  ];

  // Handlers
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleJoinChallenge = () => {
    Alert.alert("Challenge", "Joining Weekly Challenge!");
  };

  const handleLikePress = (id: string) => {
    Alert.alert("Like", `Liked post ${id}`);
  };

  const handleCommentPress = (id: string) => {
    Alert.alert("Comment", `Opening comments for post ${id}`);
  };

  const handleSharePress = (id: string) => {
    Alert.alert("Share", `Sharing post ${id}`);
  };

  const handlePostMessagePress = (id: string) => {
    Alert.alert("Message", `Send message to post ${id} author`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Back Button Only */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <CommunityStats members="2.4K" likes="12.8K" posts="856" />

        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            authorName={post.authorName}
            authorAvatar={post.authorAvatar}
            authorBadge={post.authorBadge}
            timeAgo={post.timeAgo}
            outfitImages={post.outfitImages}
            description={post.description}
            hashtags={post.hashtags}
            likes={post.likes}
            comments={post.comments}
            onLikePress={() => handleLikePress(post.id)}
            onCommentPress={() => handleCommentPress(post.id)}
            onSharePress={() => handleSharePress(post.id)}
            onMessagePress={() => handlePostMessagePress(post.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
});

export default CommunityScreen;
