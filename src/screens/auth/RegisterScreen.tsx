import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { View, Text, TextField, TouchableOpacity } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useAuth } from "../../hooks/auth";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../../components/notification/NotificationModal";

const { width, height } = Dimensions.get("window");

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, loginWithGoogle, isLoading } = useAuth();
  const { visible, config, showNotification, hideNotification } =
    useNotification();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoGlow = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formTranslateY = useSharedValue(50);
  const formOpacity = useSharedValue(0);
  const shakeAnimation = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  // Initialize animations on mount
  useEffect(() => {
    // Logo animation with glow effect
    logoScale.value = withSpring(1, {
      damping: 8,
      stiffness: 80,
    });
    
    logoRotate.value = withSequence(
      withTiming(10, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withTiming(-10, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) })
    );

    // Continuous floating animation for logo
    floatingAnimation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow pulse effect
    logoGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Header fade in and slide down
    headerOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    headerTranslateY.value = withDelay(
      300,
      withSpring(0, { damping: 12, stiffness: 90 })
    );

    // Form slide up and fade in
    formTranslateY.value = withDelay(
      500,
      withSpring(0, { damping: 12, stiffness: 90 })
    );
    formOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(logoGlow.value, [0, 1], [0.3, 0.8]);
    
    return {
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotate.value}deg` },
        { translateY: floatingAnimation.value }
      ],
      shadowOpacity: glowOpacity,
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const triggerShakeAnimation = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim()) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter your full name",
        confirmText: "OK",
      });
      return;
    }

    if (!email.trim()) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter your email",
        confirmText: "OK",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Invalid email format",
        confirmText: "OK",
      });
      return;
    }

    if (password.length < 6) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Password must be at least 6 characters",
        confirmText: "OK",
      });
      return;
    }

    try {
      const response = await register({
        email: email.trim(),
        displayName: fullName.trim(),
        password: password,
        confirmPassword: password,
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        showNotification({
          type: "success",
          title: "Registration Successful! 🎉",
          message: "Please check your email for the OTP code.",
          confirmText: "Verify Now",
          onConfirm: () => {
            navigation.navigate("Verify", { email: email.trim() });
          },
        });
      }
    } catch (error: any) {
      showNotification({
        type: "error",
        title: "Registration Failed",
        message: error?.message || "An error occurred during registration",
        confirmText: "Try Again",
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const decodedToken = await loginWithGoogle();

      // Check if first time login (string "True" from API)
      if (decodedToken.FirstTime === "True") {
        showNotification({
          type: "success",
          title: "Registration Successful",
          message: "Welcome! Let's get you started with onboarding.",
          confirmText: "OK",
        });
        // Auto navigate after showing notification
        setTimeout(() => {
          navigation.replace("Onboarding");
        }, 1500);
      } else {
        showNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
          confirmText: "OK",
        });
        // Auto navigate after showing notification
        setTimeout(() => {
          navigation.replace("Main");
        }, 1500);
      }
    } catch (error: any) {
      // Only show error notification if it's not a cancellation
      if (error?.message && !error?.message.includes("cancel")) {
        showNotification({
          type: "error",
          title: "Google Registration Failed",
          message: error?.message || "Failed to register with Google",
          confirmText: "Try Again",
        });
      }
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#1a2332', '#2c3e50', '#34495e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo and Title with Animation */}
            <View center marginB-20>
              <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("../../../assets/img/logo_text.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>

              <Animated.View style={headerAnimatedStyle}>
                <View row center marginB-8>
                  <Text style={styles.title}>Create Account </Text>
                  <Text style={styles.titleEmoji}>🎨</Text>
                </View>
                <Text style={styles.subtitle}>Start your style journey</Text>
              </Animated.View>
            </View>

            {/* Register Form Card with Glassmorphism */}
            <Animated.View style={[styles.formCard, formAnimatedStyle, shakeAnimatedStyle]}>
              <View style={styles.formInner}>
                {/* Full Name Input */}
                <View marginB-16>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="person-outline" size={20} color="#3b5998" />
                    </View>
                    <TextField
                      placeholder="Full name"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      autoCorrect={false}
                      enableErrors={false}
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View marginB-16>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="mail-outline" size={20} color="#3b5998" />
                    </View>
                    <TextField
                      placeholder="Email address"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      enableErrors={false}
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View marginB-12>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#3b5998" />
                    </View>
                    <TextField
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      enableErrors={false}
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                      containerStyle={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIconButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#3b5998"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Password Requirements */}
                <View marginB-24>
                  <Text style={styles.requirementText}>
                    Password must be at least 6 characters
                  </Text>
                </View>

                {/* Register Button with Gradient */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.registerButtonContainer}
                >
                  <LinearGradient
                    colors={['#2c5282', '#1a365d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.registerButton}
                  >
                    <Text style={styles.registerButtonText}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms and Privacy */}
                <View marginT-16>
                  <Text style={styles.termsText}>
                    By creating an account, you agree to our{" "}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                    <Text style={styles.termsLink}>Privacy Policy</Text>.
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Login Link */}
            <View row center marginT-24>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Notification Modal */}
      <NotificationModal
        isVisible={visible}
        type={config.type}
        title={config.title}
        message={config.message}
        onClose={hideNotification}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        onConfirm={config.onConfirm}
        showCancel={config.showCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  // Decorative background circles
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: height * 0.4,
    right: 20,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: '#2c5282',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 9999,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleEmoji: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Glassmorphism form card
  formCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  formInner: {
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    padding: 0,
  },
  eyeIconButton: {
    padding: 4,
  },
  requirementText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
  },
  registerButtonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2c5282',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: "600",
  },
  loginText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginLink: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
