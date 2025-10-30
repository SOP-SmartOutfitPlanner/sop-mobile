import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Shirt, 
  Heart, 
  Briefcase, 
  Zap, 
  Volleyball, 
  Watch, 
  Flower2, 
  Star,
  ShoppingBag,
  Glasses,
  Crown,
  Music,
  type LucideIcon
} from "lucide-react-native";
import { useOnboarding } from "../../hooks/onboarding";
import { Style } from "../../types/style";

// Icon mapping for different style types using Lucide icons
const getStyleIcon = (styleName: string): LucideIcon => {
  const name = styleName.toLowerCase();
  if (name.includes("casual")) return Shirt;
  if (name.includes("minimal")) return Heart;
  if (name.includes("formal") || name.includes("business")) return Briefcase;
  if (name.includes("street")) return Zap;
  if (name.includes("sport")) return Volleyball;
  if (name.includes("vintage") || name.includes("classic")) return Watch;
  if (name.includes("boho") || name.includes("bohemian")) return Flower2;
  if (name.includes("elegant") || name.includes("chic")) return Crown;
  if (name.includes("fashion")) return ShoppingBag;
  if (name.includes("retro")) return Glasses;
  if (name.includes("luxury")) return Star;
  if (name.includes("indie") || name.includes("artistic")) return Music;
  return Shirt; // default icon
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

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadStyles();
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
                  width: "33%",
                  opacity: fadeAnim,
                }
              ]} 
            />
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="shirt" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>What's your style vibe?</Text>
            <Text style={styles.subtitle}>Select all that match your taste</Text>
          </Animated.View>

          {/* Loading State */}
          {isLoading && (
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading styles...</Text>
            </Animated.View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadStyles} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#2563eb", "#1e40af"]}
                  style={styles.retryButtonGradient}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Style Grid */}
          {!isLoading && !error && (
            <Animated.View 
              style={[
                styles.gridContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              {stylesList.map((style) => {
                const isSelected = selectedStyles.includes(String(style.id));
                const IconComponent = getStyleIcon(style.name);
                return (
                  <TouchableOpacity
                    key={style.id}
                    style={[styles.styleCard, isSelected && styles.styleCardActive]}
                    onPress={() => toggleStyle(String(style.id))}
                    activeOpacity={0.7}
                  >

                    <View
                      style={[
                        styles.iconWrapper,
                        isSelected && styles.iconWrapperActive,
                      ]}
                    >
                      <IconComponent
                        size={32}
                        color="#FFFFFF"
                        strokeWidth={2.5}
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
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          )}

          {/* Buttons */}
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              disabled={selectedStyles.length === 0 || isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedStyles.length > 0 && !isLoading ? ["#2563eb", "#1e40af"] : ["#1e3a5f", "#152238"]}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  Continue ({selectedStyles.length} selected)
                </Text>
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
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#193C9F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1e40af",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
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
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  styleCard: {
    width: "48%",
    backgroundColor: "rgba(11, 27, 51, 0.8)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e3a5f",
    overflow: "hidden",
    position: "relative",
  },
  styleCardActive: {
    backgroundColor: "#133284",
    borderColor: "#133284",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#9096a1ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconWrapperActive: {
    backgroundColor: "#3b82f6",
  },
  styleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  styleLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#3b5998",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
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
