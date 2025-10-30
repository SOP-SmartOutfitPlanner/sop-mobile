import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleContinue = () => {
    onNext(bio.trim());
  };

  const handleSkip = () => {
    onNext(""); // Skip with empty bio
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={[styles.progressBar, { width: "100%" }]} />
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={48} color="#6366F1" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            Share your fashion story or style preferences (optional)
          </Text>

          {/* Bio Input */}
          <View style={styles.inputContainer}>
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
          </View>

          {/* Suggestion Chips */}
          <View style={styles.suggestionsContainer}>
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
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>
                {bio.trim() ? "Continue" : "Skip for now"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={20} color="#64748B" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    lineHeight: 20,
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
    color: "#1E293B",
  },
  characterCount: {
    fontSize: 12,
    color: "#64748B",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    fontSize: 15,
    color: "#1E293B",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  chipText: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
    marginTop: "auto",
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
