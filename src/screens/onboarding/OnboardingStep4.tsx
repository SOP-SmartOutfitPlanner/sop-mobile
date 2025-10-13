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

interface OutfitOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const outfitOptions: OutfitOption[] = [
  {
    id: "relaxed",
    icon: "leaf-outline",
    title: "Relaxed",
    description: "Comfy & casual",
  },
  {
    id: "smart",
    icon: "sparkles-outline",
    title: "Smart",
    description: "Polished & put-together",
  },
  {
    id: "bold",
    icon: "flame-outline",
    title: "Bold",
    description: "Statement pieces",
  },
];

interface OnboardingStep4Props {
  navigation: any;
  onNext: (outfit: string) => void;
  onBack: () => void;
}

export const OnboardingStep4: React.FC<OnboardingStep4Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<string>("");

  const handleContinue = () => {
    if (selectedOutfit) {
      onNext(selectedOutfit);
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
          <View style={[styles.progressBar, { width: "80%" }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Pick the outfit that feels most *you*</Text>
        <Text style={styles.subtitle}>
          This helps our AI understand your style
        </Text>

        {/* Outfit Options */}
        <View style={styles.optionsContainer}>
          {outfitOptions.map((option) => {
            const isSelected = selectedOutfit === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.outfitCard,
                  isSelected && styles.outfitCardActive,
                ]}
                onPress={() => setSelectedOutfit(option.id)}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    isSelected && styles.iconWrapperActive,
                  ]}
                >
                  <Ionicons
                    name={getIconName(option.icon)}
                    size={48}
                    color={isSelected ? "#FFFFFF" : "#6366F1"}
                  />
                </View>
                <Text
                  style={[
                    styles.outfitTitle,
                    isSelected && styles.outfitTitleActive,
                  ]}
                >
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.outfitDescription,
                    isSelected && styles.outfitDescriptionActive,
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOutfit && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedOutfit}
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
    gap: 16,
    marginBottom: 32,
  },
  outfitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  outfitCardActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconWrapperActive: {
    backgroundColor: "#6366F1",
  },
  outfitTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  outfitTitleActive: {
    color: "#6366F1",
  },
  outfitDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  outfitDescriptionActive: {
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
