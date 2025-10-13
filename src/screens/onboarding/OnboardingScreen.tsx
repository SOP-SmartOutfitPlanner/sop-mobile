import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";
import { OnboardingStep3 } from "./OnboardingStep3";
import { OnboardingStep4 } from "./OnboardingStep4";
import { OnboardingStep5 } from "./OnboardingStep5";
import { OnboardingComplete } from "./OnboardingComplete";

interface OnboardingData {
  step1?: { gender: string; age: string; location: string };
  step2?: string[];
  step3?: string[];
  step4?: string;
  step5?: string;
}

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const handleStep1Next = (data: {
    gender: string;
    age: string;
    location: string;
  }) => {
    setOnboardingData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (styles: string[]) => {
    setOnboardingData((prev) => ({ ...prev, step2: styles }));
    setCurrentStep(3);
  };

  const handleStep3Next = (goals: string[]) => {
    setOnboardingData((prev) => ({ ...prev, step3: goals }));
    setCurrentStep(4);
  };

  const handleStep4Next = (outfit: string) => {
    setOnboardingData((prev) => ({ ...prev, step4: outfit }));
    setCurrentStep(5);
  };

  const handleStep5Next = (routine: string) => {
    setOnboardingData((prev) => ({ ...prev, step5: routine }));
    setCurrentStep(6);
  };

  const handleComplete = () => {
    // Save onboarding data to backend or local storage
    console.log("Onboarding completed with data:", onboardingData);

    // Navigate to main app
    navigation.replace("Main");
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
