import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"; // green
      case "current":
        return "#3b82f6"; // blue
      default:
        return "#d1d5db"; // gray
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  { backgroundColor: getStepColor(status) },
                ]}
              >
                {status === "completed" ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      { color: status === "current" ? "#fff" : "#6b7280" },
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepTitle,
                    { color: status === "current" ? "#1f2937" : "#6b7280" },
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  { backgroundColor: getStepColor(status) },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepContent: {
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 2,
  },
  connector: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 24,
  },
});
