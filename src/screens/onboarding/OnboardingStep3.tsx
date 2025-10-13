import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface GoalOption {
  id: string;
  icon: string;
  label: string;
}

const goalOptions: GoalOption[] = [
  { id: "wardrobe", icon: "shirt-outline", label: "Manage wardrobe" },
  { id: "daily", icon: "sparkles-outline", label: "Daily outfit ideas" },
  { id: "weather", icon: "sunny-outline", label: "Match by weather" },
  { id: "community", icon: "heart-outline", label: "Share with community" },
  { id: "trends", icon: "flash-outline", label: "Discover trends" },
];

interface OnboardingStep3Props {
  navigation: any;
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      onNext(selectedGoals);
    }
  };

  const getIconName = (icon: string): any => {
    return icon as any;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: "60%" }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="radio-button-on" size={48} color="#6366F1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>What do you want SOP to help you with?</Text>
        <Text style={styles.subtitle}>Choose your goals</Text>

        {/* Goals List */}
        <View style={styles.goalsContainer}>
          {goalOptions.map((option) => {
            const isSelected = selectedGoals.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.goalCard, isSelected && styles.goalCardActive]}
                onPress={() => toggleGoal(option.id)}
              >
                <View style={styles.goalContent}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={getIconName(option.icon)}
                      size={24}
                      color={isSelected ? "#FFFFFF" : "#6366F1"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.goalLabel,
                      isSelected && styles.goalLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={isSelected ? "#6366F1" : "#CBD5E1"}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedGoals.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue ({selectedGoals.length} selected)
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    paddingVertical: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginBottom: 32,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 2,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  goalCardActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: "#6366F1",
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    flex: 1,
  },
  goalLabelActive: {
    color: "#6366F1",
    fontWeight: "600",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
