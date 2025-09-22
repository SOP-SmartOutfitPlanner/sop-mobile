import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { CHALLENGE_DATA } from "../../constants/homeData";
import {
  COLORS,
  SPACING,
  SHADOWS,
  SIZES,
  BASE_STYLES,
} from "../../constants/homeStyles";

interface ChallengeStatProps {
  value: string;
  label: string;
}

const ChallengeStat: React.FC<ChallengeStatProps> = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const WeeklyChallenge: React.FC = () => {
  return (
    <View style={[BASE_STYLES.cardBase, styles.container]}>
      <View style={styles.header}>
        <Text style={BASE_STYLES.titleBase}>Weekly Challenge</Text>
      </View>

      <View style={styles.challengeCard}>
        <ImageBackground
          source={{ uri: CHALLENGE_DATA.backgroundImage }}
          style={styles.challengeBackground}
          imageStyle={styles.challengeBackgroundImage}
        >
          <View style={styles.challengeContent}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>{CHALLENGE_DATA.title}</Text>
              <Text style={styles.challengeDescription}>
                {CHALLENGE_DATA.description}
              </Text>
            </View>

            <View style={styles.challengeStats}>
              {CHALLENGE_DATA.stats.map((stat, index) => (
                <ChallengeStat
                  key={index}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  challengeCard: {
    borderRadius: SPACING.lg,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  challengeBackground: {
    width: "100%",
    height: 200,
  },
  challengeBackgroundImage: {
    borderRadius: SPACING.lg,
  },
  challengeContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "space-between",
    backgroundColor: "rgba(139, 69, 19, 0.8)",
  },
  challengeHeader: {
    marginBottom: SPACING.md,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  challengeDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  challengeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  joinButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderRadius: SPACING.md,
    alignItems: "center",
  },
  joinButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
