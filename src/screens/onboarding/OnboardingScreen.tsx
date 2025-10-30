import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";
import { OnboardingStep3 } from "./OnboardingStep3";
import { OnboardingStep4 } from "./OnboardingStep4";
import { OnboardingStep5 } from "./OnboardingStep5";
import { OnboardingComplete } from "./OnboardingComplete";
import { useOnboarding } from "../../hooks/onboarding";
import { useNotification } from "../../hooks";
import { Gender, OnboardingRequest } from "../../types/onboarding";
import { stringToGender } from "../../utils/genderUtils";

interface OnboardingData {
  gender?: Gender;         // Gender enum: MALE=0, FEMALE=1, OTHER=2
  dob?: string;            // Date of birth in format "YYYY-MM-DD"
  location?: string;       // Location string
  styleIds?: string[];     // Array of style IDs
  jobId?: string;          // Job ID as string
  preferedColor?: string;  // Preferred color
  avoidedColor?: string;   // Avoided color
  bio?: string;            // User bio
}

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { submitOnboarding, isLoading } = useOnboarding();
  const { showNotification } = useNotification();

  // Step 1: Personal Info (gender, dob, location)
  const handleStep1Next = (data: {
    gender: string;
    dob: string;
    location: string;
  }) => {
    setOnboardingData((prev) => ({
      ...prev,
      gender: stringToGender(data.gender), // Convert string to Gender enum
      dob: data.dob, // Already in format "YYYY-MM-DD"
      location: data.location,
    }));
    setCurrentStep(2);
  };

  // Step 2: Style Selection (styleIds)
  const handleStep2Next = (styles: string[]) => {
    setOnboardingData((prev) => ({
      ...prev,
      styleIds: styles, // Array of style IDs as strings
    }));
    setCurrentStep(3);
  };

  // Step 3: Job Selection
  const handleStep3Next = (jobs: string[]) => {
    setOnboardingData((prev) => ({
      ...prev,
      jobId: jobs[0] || "1", // Take first job ID
    }));
    setCurrentStep(4);
  };

  // Step 4: Color Preferences
  const handleStep4Next = (data: {
    preferedColor: string;
    avoidedColor: string;
  }) => {
    setOnboardingData((prev) => ({
      ...prev,
      preferedColor: data.preferedColor,
      avoidedColor: data.avoidedColor,
    }));
    setCurrentStep(5);
  };

  // Step 5: Bio
  const handleStep5Next = (bio: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      bio: bio || "", // Allow empty bio
    }));
    setCurrentStep(6);
  };

  const handleComplete = async () => {
    try {
      // Validate all required data
      if (
        onboardingData.gender === undefined ||
        !onboardingData.dob ||
        !onboardingData.location ||
        !onboardingData.styleIds ||
        onboardingData.styleIds.length === 0 ||
        !onboardingData.jobId ||
        !onboardingData.preferedColor ||
        !onboardingData.avoidedColor
      ) {
        showNotification({
          type: "error",
          title: "Incomplete Information",
          message: "Please complete all onboarding steps",
          confirmText: "OK",
        });
        return;
      }

      // Prepare request data
      const requestData: OnboardingRequest = {
        preferedColor: onboardingData.preferedColor,
        avoidedColor: onboardingData.avoidedColor,
        gender: onboardingData.gender, // Already a number from Gender enum
        location: onboardingData.location,
        jobId: parseInt(onboardingData.jobId),
        dob: onboardingData.dob,
        bio: onboardingData.bio || "", // Use empty string if no bio
        styleIds: onboardingData.styleIds.map((id: string) => parseInt(id)),
      };

      // console.log("📤 Submitting onboarding data:", JSON.stringify(requestData, null, 2));

      // Submit to backend
      const result = await submitOnboarding(requestData);

      if (result.success) {
        // console.log("✅ Onboarding completed successfully:", result.data);
        
        // Show success notification
        showNotification({
          type: "success",
          title: "Welcome! 🎉",
          message: "Your profile has been created successfully!",
          confirmText: "Let's Start",
        });
        
        // Navigate to Main screen after showing notification
        setTimeout(() => {
          navigation.replace("Main");
        }, 1500); // 1.5 second delay to let user see the success message
      }
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      showNotification({
        type: "error",
        title: "Onboarding Failed",
        message: error?.message || "Failed to complete onboarding. Please try again.",
        confirmText: "Try Again",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 1 && (
        <OnboardingStep1 navigation={navigation} onNext={handleStep1Next} />
      )}
      {currentStep === 2 && (
        <OnboardingStep2
          navigation={navigation}
          onNext={handleStep2Next}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <OnboardingStep3
          navigation={navigation}
          onNext={handleStep3Next}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <OnboardingStep4
          navigation={navigation}
          onNext={handleStep4Next}
          onBack={handleBack}
        />
      )}
      {currentStep === 5 && (
        <OnboardingStep5
          navigation={navigation}
          onNext={handleStep5Next}
          onBack={handleBack}
        />
      )}
      {currentStep === 6 && (
        <OnboardingComplete
          navigation={navigation}
          onComplete={handleComplete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
