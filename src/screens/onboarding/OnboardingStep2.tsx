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

interface StyleOption {
  id: string;
  icon: string;
  label: string;
}

const styleOptions: StyleOption[] = [
  { id: "casual", icon: "shirt-outline", label: "Casual" },
  { id: "minimalist", icon: "heart-outline", label: "Minimalist" },
  { id: "formal", icon: "briefcase-outline", label: "Formal" },
  { id: "streetwear", icon: "fitness-outline", label: "Streetwear" },
  { id: "sporty", icon: "flash-outline", label: "Sporty" },
  { id: "vintage", icon: "time-outline", label: "Vintage" },
];

interface OnboardingStep2Props {
  navigation: any;
  onNext: (styles: string[]) => void;
  onBack: () => void;
}

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleContinue = () => {
    if (selectedStyles.length > 0) {
      onNext(selectedStyles);
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
          <View style={[styles.progressBar, { width: "40%" }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="shirt" size={48} color="#6366F1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>What's your style vibe?</Text>
        <Text style={styles.subtitle}>Select all that match your taste</Text>

        {/* Style Grid */}
        <View style={styles.gridContainer}>
          {styleOptions.map((option) => {
            const isSelected = selectedStyles.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.styleCard, isSelected && styles.styleCardActive]}
                onPress={() => toggleStyle(option.id)}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    isSelected && styles.iconWrapperActive,
                  ]}
                >
                  <Ionicons
                    name={getIconName(option.icon)}
                    size={32}
                    color={isSelected ? "#FFFFFF" : "#6366F1"}
                  />
                </View>
                <Text
                  style={[
                    styles.styleLabel,
                    isSelected && styles.styleLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedStyles.length === 0 && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={selectedStyles.length === 0}
          >
            <Text style={styles.continueButtonText}>
              Continue ({selectedStyles.length} selected)
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  styleCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  styleCardActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconWrapperActive: {
    backgroundColor: "#6366F1",
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  styleLabelActive: {
    color: "#6366F1",
  },
  buttonContainer: {
    gap: 12,
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
