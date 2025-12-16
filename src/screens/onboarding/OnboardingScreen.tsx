import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { OnboardingStep0 } from "./OnboardingStep0";
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";
import { OnboardingStep3 } from "./OnboardingStep3";
import { OnboardingStep4 } from "./OnboardingStep4";
import { OnboardingStep5 } from "./OnboardingStep5";
import { OnboardingStep6 } from "./OnboardingStep6";
import { useOnboarding } from "../../hooks/onboarding";
import { useNotification } from "../../hooks";
import { Gender, OnboardingRequest } from "../../types/onboarding";
import { stringToGender } from "../../utils/genderUtils";

interface OnboardingData {
  gender?: Gender; 
  dob?: string; 
  location?: string; 
  styleIds?: string[]; 
  otherStyles?: string[]; 
  jobId?: string; 
  otherJob?: string; 
  preferedColor?: string[]; 
  avoidedColor?: string[]; 
  bio?: string; 
  tryOnImageUrl?: string; 
}

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { submitOnboarding, isLoading } = useOnboarding();
  const { showNotification } = useNotification();

  // Step 0: What You Use SOP For (UI only - no data saved)
  const handleStep0Next = () => {
    // Just move to next step, don't save any data
    setCurrentStep(1);
  };

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
  const handleStep2Next = (data: {
    styleIds: string[];
    otherStyles: string[];
  }) => {
    setOnboardingData((prev) => ({
      ...prev,
      styleIds: data.styleIds, // Array of style IDs as strings
      otherStyles: data.otherStyles, // Array of custom styles
    }));
    setCurrentStep(3);
  };

  // Step 3: Job Selection
  const handleStep3Next = (data: {
    jobId: string | null;
    otherJob: string;
  }) => {
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

  // Step 6: Try-On Images
  const handleStep6Next = async (imageUrls: string[]) => {
    // Update state and wait for it to be set before proceeding
    const updatedData = {
      ...onboardingData,
      tryOnImageUrl: imageUrls.length > 0 ? imageUrls[0] : undefined,
    };
    setOnboardingData(updatedData);
    
    // Call handleComplete directly with the updated data
    await handleCompleteWithData(updatedData);
  };

  const handleCompleteWithData = async (data: OnboardingData) => {
    try {
      // console.log("🔍 Starting onboarding submission...");
      // console.log("📦 Current onboarding data:", JSON.stringify(data, null, 2));

      // Validate all required data
      const hasStyles =
        (data.styleIds && data.styleIds.length > 0) ||
        (data.otherStyles && data.otherStyles.length > 0);

      if (
        data.gender === undefined ||
        !data.dob ||
        !data.location ||
        !hasStyles ||
        (!data.jobId && !data.otherJob) ||
        !data.preferedColor ||
        data.preferedColor.length === 0 ||
        !data.avoidedColor ||
        data.avoidedColor.length === 0 ||
        !data.tryOnImageUrl
      ) {
        console.log("❌ Validation failed!");
        console.log("Validation details:", {
          hasGender: data.gender !== undefined,
          hasDob: !!data.dob,
          hasLocation: !!data.location,
          hasStyles: hasStyles,
          hasStyleIds: !!(
            data.styleIds && data.styleIds.length > 0
          ),
          hasOtherStyles: !!(
            data.otherStyles && data.otherStyles.length > 0
          ),
          hasJob: !!(data.jobId || data.otherJob),
          hasPreferedColor: !!(
            data.preferedColor &&
            data.preferedColor.length > 0
          ),
          hasAvoidedColor: !!(
            data.avoidedColor &&
            data.avoidedColor.length > 0
          ),
          hasTryOnImage: !!data.tryOnImageUrl,
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
        if (color.startsWith("#")) {
          return `custom color ${color}`;
        }
        // Otherwise, just lowercase the name
        return color.toLowerCase();
      };

      // Prepare request data
      const requestData: OnboardingRequest = {
        preferedColor: data.preferedColor.map(formatColorName),
        avoidedColor: data.avoidedColor.map(formatColorName),
        gender: data.gender, // Already a number from Gender enum
        location: data.location,
        dob: data.dob,
        bio: data.bio || "",
      };

      // Only include jobId if user selected a predefined job
      if (data.jobId) {
        requestData.jobId = parseInt(data.jobId);
      }

      // Only include otherJob if user entered a custom job
      if (data.otherJob) {
        requestData.otherJob = data.otherJob;
      }

      // Only include styleIds if user selected predefined styles
      if (data.styleIds && data.styleIds.length > 0) {
        requestData.styleIds = data.styleIds.map((id: string) =>
          parseInt(id)
        );
      }

      // Only include otherStyles if user entered custom styles
      if (data.otherStyles && data.otherStyles.length > 0) {
        requestData.otherStyles = data.otherStyles;
      }

      // Include tryOnImageUrl
      if (data.tryOnImageUrl) {
        requestData.tryOnImageUrl = data.tryOnImageUrl;
      }

      console.log(
        "📤 Submitting onboarding data:",
        JSON.stringify(requestData, null, 2)
      );

      // Submit to backend
      const result = await submitOnboarding(requestData);

      // console.log("📥 API response:", result);

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
        message:
          error?.message || "Failed to complete onboarding. Please try again.",
        confirmText: "Try Again",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 0 && (
        <OnboardingStep0 navigation={navigation} onNext={handleStep0Next} />
      )}
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
        <OnboardingStep6
          navigation={navigation}
          onNext={handleStep6Next}
          onBack={handleBack}
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
