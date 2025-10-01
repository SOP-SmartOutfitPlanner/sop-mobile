import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OutfitCard, OutfitItem } from "./OutfitCard";
import { ProfileTab } from "./ProfileTabs";

interface ProfileContentProps {
  activeTab: ProfileTab;
  outfits: OutfitItem[];
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  outfits,
}) => {
  return (
    <View style={styles.contentContainer}>
      {activeTab === "Outfits" && (
        <View style={styles.outfitsContainer}>
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
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
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 200,
  },
  outfitsContainer: {
    gap: 16,
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
});
