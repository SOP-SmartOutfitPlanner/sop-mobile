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
  otherStyles?: string[];  // Array of custom styles
  jobId?: string;          // Job ID as string
  otherJob?: string;       // Custom job title
  preferedColor?: string[];  // Preferred colors array
  avoidedColor?: string[];   // Avoided colors array
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

  // Step 2: Style Selection (styleIds and otherStyles)
  const handleStep2Next = (data: { styleIds: string[], otherStyles: string[] }) => {
    setOnboardingData((prev) => ({
      ...prev,
      styleIds: data.styleIds, // Array of style IDs as strings
      otherStyles: data.otherStyles, // Array of custom styles
    }));
    setCurrentStep(3);
  };

  // Step 3: Job Selection
  const handleStep3Next = (data: { jobId: string | null, otherJob: string }) => {
    setOnboardingData((prev) => ({
      ...prev,
      jobId: data.jobId || undefined,
      otherJob: data.otherJob || undefined,
    }));
    setCurrentStep(4);
  };

  // Step 4: Color Preferences
  const handleStep4Next = (data: {
    preferedColor: string[];
    avoidedColor: string[];
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
      // console.log("🔍 Starting onboarding submission...");
      // console.log("📦 Current onboarding data:", JSON.stringify(onboardingData, null, 2));
      
      // Validate all required data
      const hasStyles = (onboardingData.styleIds && onboardingData.styleIds.length > 0) || 
                       (onboardingData.otherStyles && onboardingData.otherStyles.length > 0);
      
      if (
        onboardingData.gender === undefined ||
        !onboardingData.dob ||
        !onboardingData.location ||
        !hasStyles ||
        (!onboardingData.jobId && !onboardingData.otherJob) ||
        !onboardingData.preferedColor ||
        onboardingData.preferedColor.length === 0 ||
        !onboardingData.avoidedColor ||
        onboardingData.avoidedColor.length === 0
      ) {
        console.log("❌ Validation failed!");
        console.log("Validation details:", {
          hasGender: onboardingData.gender !== undefined,
          hasDob: !!onboardingData.dob,
          hasLocation: !!onboardingData.location,
          hasStyles: hasStyles,
          hasStyleIds: !!(onboardingData.styleIds && onboardingData.styleIds.length > 0),
          hasOtherStyles: !!(onboardingData.otherStyles && onboardingData.otherStyles.length > 0),
          hasJob: !!(onboardingData.jobId || onboardingData.otherJob),
          hasPreferedColor: !!(onboardingData.preferedColor && onboardingData.preferedColor.length > 0),
          hasAvoidedColor: !!(onboardingData.avoidedColor && onboardingData.avoidedColor.length > 0),
        });
        showNotification({
          type: "error",
          title: "Incomplete Information",
          message: "Please complete all onboarding steps",
          confirmText: "OK",
        });
        return;
      }
      
      console.log("✅ Validation passed!");

      // Helper function to convert color to lowercase name
      const formatColorName = (color: string): string => {
        // If it's a hex code, convert to descriptive name
        if (color.startsWith('#')) {
          return `custom color ${color}`;
        }
        // Otherwise, just lowercase the name
        return color.toLowerCase();
      };

      // Prepare request data
      const requestData: OnboardingRequest = {
        preferedColor: onboardingData.preferedColor.map(formatColorName),
        avoidedColor: onboardingData.avoidedColor.map(formatColorName),
        gender: onboardingData.gender, // Already a number from Gender enum
        location: onboardingData.location,
        dob: onboardingData.dob,
        bio: onboardingData.bio || "",
      };

      // Only include jobId if user selected a predefined job
      if (onboardingData.jobId) {
        requestData.jobId = parseInt(onboardingData.jobId);
      }

      // Only include otherJob if user entered a custom job
      if (onboardingData.otherJob) {
        requestData.otherJob = onboardingData.otherJob;
      }

      // Only include styleIds if user selected predefined styles
      if (onboardingData.styleIds && onboardingData.styleIds.length > 0) {
        requestData.styleIds = onboardingData.styleIds.map((id: string) => parseInt(id));
      }

      // Only include otherStyles if user entered custom styles
      if (onboardingData.otherStyles && onboardingData.otherStyles.length > 0) {
        requestData.otherStyles = onboardingData.otherStyles;
      }

      console.log("📤 Submitting onboarding data:", JSON.stringify(requestData, null, 2));

      // Submit to backend
      const result = await submitOnboarding(requestData);
      
      console.log("📥 API response:", result);

      if (result.success) {
        console.log("✅ Onboarding completed successfully:", result.data);
        
        // Show success notification
        showNotification({
          type: "success",
          title: "Welcome! 🎉",
          message: "Your profile has been created successfully!",
          confirmText: "Let's Start",
        });
        
        // Navigate to Main screen after showing notification
        setTimeout(() => {
          console.log("🚀 Navigating to Main screen...");
          navigation.replace("Main");
        }, 1500); // 1.5 second delay to let user see the success message
      } else {
        console.log("⚠️ API returned success=false:", result);
      }
    } catch (error: any) {
      console.error("❌ Error completing onboarding:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
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
