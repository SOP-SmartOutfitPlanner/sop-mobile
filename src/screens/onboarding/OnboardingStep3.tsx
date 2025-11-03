import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useOnboarding } from "../../hooks/onboarding";

// Icon mapping for different job types
const getJobIcon = (jobName: string): string => {
  const name = jobName.toLowerCase();
  
  // Specific job matches from API
  if (name.includes("student")) return "school-outline";
  if (name.includes("office worker")) return "briefcase-outline";
  if (name.includes("influencer")) return "megaphone-outline";
  if (name.includes("fashion stylist") || name.includes("stylist")) return "shirt-outline";
  if (name.includes("content creator") || name.includes("creator")) return "create-outline";
  if (name.includes("photographer")) return "camera-outline";
  if (name.includes("software engineer") || name.includes("engineer")) return "code-slash-outline";
  if (name.includes("tester") || name.includes("qa")) return "bug-outline";
  
  // General fallbacks
  if (name.includes("design") || name.includes("creative") || name.includes("artist")) return "brush-outline";
  if (name.includes("medical") || name.includes("doctor") || name.includes("nurse")) return "medical-outline";
  if (name.includes("teacher") || name.includes("professor")) return "book-outline";
  if (name.includes("sales") || name.includes("marketing")) return "trending-up-outline";
  if (name.includes("freelance") || name.includes("entrepreneur")) return "rocket-outline";
  if (name.includes("hospitality") || name.includes("service")) return "restaurant-outline";
  
  return "person-outline"; // default icon
};

interface OnboardingStep3Props {
  navigation: any;
  onNext: (data: { jobId: string | null, otherJob: string }) => void;
  onBack: () => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherJobText, setOtherJobText] = useState("");
  const { jobs, fetchJobs, isLoading } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setError(null);
      await fetchJobs();
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    }
  };

  const selectJob = (jobId: string) => {
    // Only single selection for job
    setSelectedJob(jobId);
    setShowOtherInput(false); // Hide other input when selecting a job
    setOtherJobText("");
  };

  const handleSelectOther = () => {
    setSelectedJob(null); // Deselect any job
    setShowOtherInput(true);
  };

  const handleContinue = () => {
    if (selectedJob) {
      onNext({ jobId: selectedJob, otherJob: "" });
    } else if (otherJobText.trim()) {
      onNext({ jobId: null, otherJob: otherJobText.trim() });
    }
  };

  const getIconName = (icon: string): any => {
    return icon as any;
  };

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadJobs();
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

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={"padding"}
          style={styles.keyboardAvoid}
        >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: "50%",
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
                <Ionicons name="briefcase" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>What's your profession?</Text>
            <Text style={styles.subtitle}>Select your job or field</Text>
          </Animated.View>

            {/* Loading State */}
          {isLoading && (
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading jobs...</Text>
            </Animated.View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadJobs} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#2563eb", "#1e40af"]}
                  style={styles.retryButtonGradient}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Jobs List */}
          {!isLoading && !error && (
            <Animated.View 
              style={[
                styles.goalsContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
            {jobs.map((job) => {
              const isSelected = selectedJob === String(job.id);
              const iconName = getJobIcon(job.name);
              return (
                <TouchableOpacity
                  key={job.id}
                  style={[styles.goalCard, isSelected && styles.goalCardActive]}
                  onPress={() => selectJob(String(job.id))}
                >
                  <View style={styles.goalContent}>
                    <View
                      style={[
                        styles.unselectedIconCircle,
                        isSelected && styles.iconCircleActive,
                      ]}
                    >
                      <Ionicons
                        name={getIconName(iconName)}
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text
                      style={[
                        styles.goalLabel,
                        isSelected && styles.goalLabelActive,
                      ]}
                    >
                      {job.name}
                    </Text>
                  </View>
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isSelected ? "#2563eb" : "rgba(255, 255, 255, 0.3)"}
                  />
                </TouchableOpacity>
              );
            })}

            {/* Other Job Option */}
            <TouchableOpacity
              style={[styles.goalCard, showOtherInput && styles.goalCardActive]}
              onPress={handleSelectOther}
            >
              <View style={styles.goalContent}>
                <View
                  style={[
                    styles.unselectedIconCircle,
                    showOtherInput && styles.iconCircleActive,
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <Text
                  style={[
                    styles.goalLabel,
                    showOtherInput && styles.goalLabelActive,
                  ]}
                >
                  Other (Specify)
                </Text>
              </View>
              <Ionicons
                name={showOtherInput ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={showOtherInput ? "#2563eb" : "rgba(255, 255, 255, 0.3)"}
              />
            </TouchableOpacity>
            </Animated.View>
          )}

          {/* Other Job Input */}
          {!isLoading && !error && showOtherInput && (
            <Animated.View style={[styles.otherSection, { opacity: fadeAnim }]}>
              <Text style={styles.otherTitle}>Enter your job/profession:</Text>
              <TextInput
                style={styles.otherInput}
                value={otherJobText}
                onChangeText={setOtherJobText}
                placeholder="e.g., Freelance Designer, Artist..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoFocus
              />
            </Animated.View>
          )}

          {/* Continue Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity
          style={[
            styles.continueButton,
            ((!selectedJob && !otherJobText.trim()) || isLoading) && styles.disabledButton,
          ]}
            onPress={handleContinue}
            disabled={(!selectedJob && !otherJobText.trim()) || isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={(selectedJob || otherJobText.trim()) && !isLoading ? ["#2563eb", "#1e40af"] : ["#1e3a5f", "#152238"]}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>
                Continue {(selectedJob || otherJobText.trim()) ? "(1 selected)" : ""}
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
  unselectedIconCircle:{
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#88898bff",
    alignItems: "center",
    justifyContent: "center",
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
  goalsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(11, 27, 51, 0.8)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#1e3a5f",
  },
  goalCardActive: {
    backgroundColor: "#1e4d8b",
    borderColor: "#2563eb",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircleActive: {
    backgroundColor: "#306AF3",
    
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1,
  },
  goalLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  otherSection: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otherTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  otherInput: {
    backgroundColor: "rgba(11, 27, 51, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  keyboardAvoid: {
    flex: 1,
  },
});

