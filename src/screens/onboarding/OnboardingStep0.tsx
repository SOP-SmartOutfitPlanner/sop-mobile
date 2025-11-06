import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Shirt, Heart, Zap } from "lucide-react-native";

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const goals: Goal[] = [
  {
    id: "ai-recommendations",
    title: "AI-Powered Recommendations",
    description: "Get personalized outfit suggestions based on weather, occasion, and your personal style preferences.",
    icon: Sparkles,
  },
  {
    id: "wardrobe-management",
    title: "Smart Wardrobe Management",
    description: "Organize your clothes digitally, track what you wear, and discover new combinations you never thought of.",
    icon: Shirt,
  },
  {
    id: "style-profile",
    title: "Personalized Style Profile",
    description: "Build a profile that reflects your unique taste, favorite colors, and lifestyle needs.",
    icon: Heart,
  },
  {
    id: "save-time",
    title: "Save Time Every Morning",
    description: "No more staring at your closet wondering what to wear. Get instant outfit suggestions that work.",
    icon: Zap,
  },
];

interface OnboardingStep0Props {
  navigation: any;
  onNext: () => void; // No data needed, just move to next step
}

export const OnboardingStep0: React.FC<OnboardingStep0Props> = ({
  navigation,
  onNext,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    // No need to pass data, just move to next step
    onNext();
  };

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: "0%",
                  opacity: fadeAnim,
                },
              ]}
            />
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Title */}
            <Text style={styles.title}>What You Use SOP For?</Text>
            <Text style={styles.subtitle}>
              Select what matters most to you (optional)
            </Text>
          </Animated.View>

          {/* Goals Grid */}
          <Animated.View
            style={[
              styles.goalsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {goals.map((goal, index) => {
              const isSelected = selectedGoals.includes(goal.id);
              const IconComponent = goal.icon;

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardActive,
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.goalContent}>
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && styles.iconCircleActive,
                      ]}
                    >
                      <IconComponent size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.goalTextContainer}>
                      <Text
                        style={[
                          styles.goalTitle,
                          isSelected && styles.goalTitleActive,
                        ]}
                      >
                        {goal.title}
                      </Text>
                      <Text style={styles.goalDescription}>
                        {goal.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Continue Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#2563eb", "#1e40af"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  goalCard: {
    backgroundColor: "rgba(11, 27, 51, 0.6)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  goalCardActive: {
    backgroundColor: "rgba(37, 99, 235, 0.2)",
    borderColor: "#2563eb",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: "#2563eb",
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 6,
  },
  goalTitleActive: {
    color: "#FFFFFF",
  },
  goalDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 16,
  },
  continueButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
