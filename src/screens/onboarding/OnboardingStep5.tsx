import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface OnboardingStep5Props {
  navigation: any;
  onNext: (bio: string) => void;
  onBack: () => void;
}

export const OnboardingStep5: React.FC<OnboardingStep5Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [bio, setBio] = useState("");
  const maxLength = 200;

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

  const handleContinue = () => {
    onNext(bio.trim());
  };

  const handleSkip = () => {
    onNext(""); // Skip with empty bio
  };

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
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
                    width: "100%",
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
                  <Ionicons name="person" size={48} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                Share your fashion story or style preferences 
              </Text>
            </Animated.View>

            {/* Bio Input */}
            <Animated.View 
              style={[
                styles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Your Bio</Text>
              <Text style={styles.characterCount}>
                {bio.length}/{maxLength}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="E.g., I love mixing casual with elegant pieces. Always looking for sustainable fashion options..."
              placeholderTextColor="#94A3B8"
              value={bio}
              onChangeText={(text) => {
                if (text.length <= maxLength) {
                  setBio(text);
                }
              }}
              multiline
              numberOfLines={6}
              maxLength={maxLength}
              textAlignVertical="top"
            />
            </Animated.View>

            {/* Suggestion Chips */}
            <Animated.View 
              style={[
                styles.suggestionsContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
            <Text style={styles.suggestionsTitle}>💡 Quick suggestions:</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() =>
                  setBio("Fashion enthusiast who loves experimenting with styles")
                }
              >
                <Text style={styles.chipText}>Fashion enthusiast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() =>
                  setBio("Minimalist style lover, always looking for timeless pieces")
                }
              >
                <Text style={styles.chipText}>Minimalist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() =>
                  setBio("Eco-conscious fashionista seeking sustainable options")
                }
              >
                <Text style={styles.chipText}>Eco-conscious</Text>
              </TouchableOpacity>
            </View>
            </Animated.View>

            {/* Buttons */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#2563eb", "#1e40af"]}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueButtonText}>
                    {bio.trim() ? "Continue" : "Skip for now"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardContainer: {
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
    backgroundColor: "#193C9E",
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
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  characterCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    fontSize: 15,
    color: "#FFFFFF",
    minHeight: 140,
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "rgba(37, 99, 235, 0.3)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.5)",
  },
  chipText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
    marginTop: "auto",
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2563eb",
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
