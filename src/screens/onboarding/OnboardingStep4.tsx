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

interface ColorOption {
  name: string;
  hex: string;
  display: string;
}

const colorOptions: ColorOption[] = [
  { name: "Black", hex: "#000000", display: "⚫" },
  { name: "White", hex: "#FFFFFF", display: "⚪" },
  { name: "Red", hex: "#EF4444", display: "🔴" },
  { name: "Blue", hex: "#3B82F6", display: "🔵" },
  { name: "Green", hex: "#10B981", display: "🟢" },
  { name: "Yellow", hex: "#F59E0B", display: "🟡" },
  { name: "Purple", hex: "#8B5CF6", display: "🟣" },
  { name: "Pink", hex: "#EC4899", display: "🩷" },
  { name: "Orange", hex: "#F97316", display: "🟠" },
  { name: "Brown", hex: "#92400E", display: "🟤" },
  { name: "Gray", hex: "#6B7280", display: "⚫" },
  { name: "Navy", hex: "#1E3A8A", display: "🔵" },
];

interface OnboardingStep4Props {
  navigation: any;
  onNext: (data: { preferedColor: string; avoidedColor: string }) => void;
  onBack: () => void;
}

export const OnboardingStep4: React.FC<OnboardingStep4Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [preferedColor, setPreferedColor] = useState<string | null>(null);
  const [avoidedColor, setAvoidedColor] = useState<string | null>(null);

  const handleColorSelect = (type: "preferred" | "avoided", color: string) => {
    if (type === "preferred") {
      // Don't allow selecting same color as avoided
      if (color === avoidedColor) {
        setAvoidedColor(null);
      }
      setPreferedColor(color);
    } else {
      // Don't allow selecting same color as preferred
      if (color === preferedColor) {
        setPreferedColor(null);
      }
      setAvoidedColor(color);
    }
  };

  const handleContinue = () => {
    if (preferedColor && avoidedColor) {
      onNext({ preferedColor, avoidedColor });
    }
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

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="color-palette" size={48} color="#6366F1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>What colors do you love?</Text>
        <Text style={styles.subtitle}>Help us personalize your style</Text>

        {/* Preferred Color Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Preferred Color</Text>
          </View>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => {
              const isSelected = preferedColor === color.name;
              const isDisabled = avoidedColor === color.name;
              return (
                <TouchableOpacity
                  key={`preferred-${color.name}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelected,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("preferred", color.name)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                      color.name === "White" && styles.whiteCircle,
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Avoided Color Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Avoided Color</Text>
          </View>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => {
              const isSelected = avoidedColor === color.name;
              const isDisabled = preferedColor === color.name;
              return (
                <TouchableOpacity
                  key={`avoided-${color.name}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelectedAvoided,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("avoided", color.name)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                      color.name === "White" && styles.whiteCircle,
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.name}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkmark, styles.checkmarkAvoided]}>
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!preferedColor || !avoidedColor) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!preferedColor || !avoidedColor}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#64748B" />
            <Text style={styles.backButtonText}>Back</Text>
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
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCard: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  colorCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  colorCardSelectedAvoided: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  colorCardDisabled: {
    opacity: 0.3,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  whiteCircle: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  colorName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
  },
  colorNameSelected: {
    color: "#1E293B",
    fontWeight: "600",
  },
  colorNameDisabled: {
    color: "#CBD5E1",
  },
  checkmark: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkAvoided: {
    backgroundColor: "#EF4444",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
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
  backButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
});
