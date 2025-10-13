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

interface RoutineOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const routineOptions: RoutineOption[] = [
  {
    id: "quick",
    icon: "cafe-outline",
    title: "Quick & simple",
    description: "Get ready fast",
  },
  {
    id: "aesthetic",
    icon: "sunny-outline",
    title: "Chill & aesthetic",
    description: "Take your time",
  },
  {
    id: "energetic",
    icon: "flash-outline",
    title: "Energetic & bold",
    description: "Make a statement",
  },
];

interface OnboardingStep5Props {
  navigation: any;
  onNext: (routine: string) => void;
  onBack: () => void;
}

export const OnboardingStep5: React.FC<OnboardingStep5Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<string>("");

  const handleContinue = () => {
    if (selectedRoutine) {
      onNext(selectedRoutine);
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
          <View style={[styles.progressBar, { width: "100%" }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Your ideal morning routine?</Text>
        <Text style={styles.subtitle}>
          One more step to find your style persona
        </Text>

        {/* Routine Options */}
        <View style={styles.optionsContainer}>
          {routineOptions.map((option) => {
            const isSelected = selectedRoutine === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.routineCard,
                  isSelected && styles.routineCardActive,
                ]}
                onPress={() => setSelectedRoutine(option.id)}
              >
                <View style={styles.routineContent}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={getIconName(option.icon)}
                      size={32}
                      color={isSelected ? "#FFFFFF" : "#6366F1"}
                    />
                  </View>
                  <View style={styles.textContent}>
                    <Text
                      style={[
                        styles.routineTitle,
                        isSelected && styles.routineTitleActive,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.routineDescription,
                        isSelected && styles.routineDescriptionActive,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={20}
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
            !selectedRoutine && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedRoutine}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  routineCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  routineCardActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  routineContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: "#6366F1",
  },
  textContent: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  routineTitleActive: {
    color: "#6366F1",
  },
  routineDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  routineDescriptionActive: {
    color: "#6366F1",
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
