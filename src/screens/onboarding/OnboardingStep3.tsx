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

// Icon mapping for different job types
const getJobIcon = (jobName: string): string => {
  const name = jobName.toLowerCase();
  if (name.includes("student") || name.includes("education")) return "school-outline";
  if (name.includes("engineer") || name.includes("developer") || name.includes("tech")) return "code-outline";
  if (name.includes("business") || name.includes("manager") || name.includes("executive")) return "briefcase-outline";
  if (name.includes("design") || name.includes("creative") || name.includes("artist")) return "brush-outline";
  if (name.includes("medical") || name.includes("doctor") || name.includes("nurse")) return "medical-outline";
  if (name.includes("teacher") || name.includes("professor")) return "book-outline";
  if (name.includes("sales") || name.includes("marketing")) return "megaphone-outline";
  if (name.includes("freelance") || name.includes("entrepreneur")) return "rocket-outline";
  if (name.includes("hospitality") || name.includes("service")) return "restaurant-outline";
  return "person-outline"; // default icon
};

interface OnboardingStep3Props {
  navigation: any;
  onNext: (jobs: string[]) => void;
  onBack: () => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
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
  };

  const handleContinue = () => {
    if (selectedJob) {
      onNext([selectedJob]); // Pass as array for consistency
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
          <View style={[styles.progressBar, { width: "50%" }]} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="briefcase" size={48} color="#6366F1" />
        </View>

        {/* Title */}
        <Text style={styles.title}>What's your profession?</Text>
        <Text style={styles.subtitle}>Select your job or field</Text>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadJobs}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Jobs List */}
        {!isLoading && !error && (
          <View style={styles.goalsContainer}>
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
                        styles.iconCircle,
                        isSelected && styles.iconCircleActive,
                      ]}
                    >
                      <Ionicons
                        name={getIconName(iconName)}
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
                      {job.name}
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
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedJob || isLoading) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedJob || isLoading}
        >
          <Text style={styles.continueButtonText}>
            Continue {selectedJob ? "(1 selected)" : ""}
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
    flexShrink: 0,
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
