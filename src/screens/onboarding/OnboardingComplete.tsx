import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface FeatureItem {
  icon: string;
  title: string;
}

const features: FeatureItem[] = [
  { icon: "shirt-outline", title: "Smart\nwardrobe" },
  { icon: "sparkles-outline", title: "AI stylist" },
  { icon: "sunny-outline", title: "Weather aware" },
];

interface OnboardingCompleteProps {
  navigation: any;
  onComplete: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  navigation,
  onComplete,
}) => {
  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.sequence([
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
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getIconName = (icon: string): any => {
    return icon as any;
  };

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={64} color="#FFFFFF" />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Title */}
            <Text style={styles.title}>You're all set!</Text>
            <Text style={styles.subtitle}>
              Your preferences are saved. Your AI stylist is ready to help you look
              your best every day.
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View 
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
          {features.map((feature, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <View style={styles.featureIconCircle}>
                <Ionicons
                  name={getIconName(feature.icon)}
                  size={28}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </Animated.View>
          ))}
          </Animated.View>

          {/* Start Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1E3AFF", "#3E7BFF", "#6FB9FF"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Start My Journey</Text>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
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
    paddingVertical: 40,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#193C9E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#1e40af",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
  },
  featureIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#193C9E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#1e40af",
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 16,
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
    // shadowColor: "#193C9E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  startButtonGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
