import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../hooks/onboarding";
import { Style } from "../../types/style";

// Icon mapping for different style types
const getStyleIcon = (styleName: string): string => {
  const name = styleName.toLowerCase();
  if (name.includes("casual")) return "shirt-outline";
  if (name.includes("minimal")) return "heart-outline";
  if (name.includes("formal") || name.includes("business")) return "briefcase-outline";
  if (name.includes("street")) return "fitness-outline";
  if (name.includes("sport")) return "flash-outline";
  if (name.includes("vintage") || name.includes("classic")) return "time-outline";
  if (name.includes("boho") || name.includes("bohemian")) return "flower-outline";
  if (name.includes("elegant") || name.includes("chic")) return "star-outline";
  return "shirt-outline"; // default icon
};

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
  const { styles: stylesList, fetchStyles, isLoading } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStyles();
  }, []);

  const loadStyles = async () => {
    try {
      setError(null);
      await fetchStyles();
    } catch (err: any) {
      setError(err.message || "Failed to load styles");
    }
  };

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
          <View style={[styles.progressBar, { width: "33%" }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="shirt" size={48} color="#6366F1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>What's your style vibe?</Text>
        <Text style={styles.subtitle}>Select all that match your taste</Text>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading styles...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadStyles}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Style Grid */}
        {!isLoading && !error && (
          <View style={styles.gridContainer}>
            {stylesList.map((style) => {
              const isSelected = selectedStyles.includes(String(style.id));
              const iconName = getStyleIcon(style.name);
              return (
                <TouchableOpacity
                  key={style.id}
                  style={[styles.styleCard, isSelected && styles.styleCardActive]}
                  onPress={() => toggleStyle(String(style.id))}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      isSelected && styles.iconWrapperActive,
                    ]}
                  >
                    <Ionicons
                      name={getIconName(iconName)}
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
                    {style.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (selectedStyles.length === 0 || isLoading) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={selectedStyles.length === 0 || isLoading}
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 16,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
