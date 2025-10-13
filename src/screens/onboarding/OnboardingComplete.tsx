import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface FeatureItem {
  icon: string;
  title: string;
}

const features: FeatureItem[] = [
  { icon: "shirt-outline", title: "Smart\nwardrobe" },
  { icon: "sparkles-outline", title: "AI stylist" },
  { icon: "sunny-outline", title: "Weather aware" },
];

interface OnboardingCompleteProps {
  navigation: any;
  onComplete: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  navigation,
  onComplete,
}) => {
  const getIconName = (icon: string): any => {
    return icon as any;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={64} color="#6366F1" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>
          Your preferences are saved. Your AI stylist is ready to help you look
          your best every day.
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons
                  name={getIconName(feature.icon)}
                  size={28}
                  color="#6366F1"
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={onComplete}>
          <Text style={styles.startButtonText}>Start My Journey</Text>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
  },
  featureIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 16,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
