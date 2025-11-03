import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import NotificationModal from "../../components/notification/NotificationModal";
import { useNotification } from "../../hooks";

const { width, height } = Dimensions.get("window");

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, isLoading } = useAuth();
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
  const buttonScale = useSharedValue(1);
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

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter email and password",
        confirmText: "OK",
      });
      return;
    }

    try {
      const decodedToken = await login({ email, password });

      // Check if first time login (string "True" from API)
      if (decodedToken.FirstTime === "True") {
        showNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome! Let's get you started with onboarding.",
          confirmText: "Ok",
          onConfirm: () => {
            navigation.replace("Onboarding");
          },
        });
      } else {
        showNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome! Let's get you started with the app.",
          showCancel: true,
          confirmText: "Start",
          cancelText: "Cancel",
          onConfirm: () => {
            navigation.replace("Main");
          },
        });
      }
    } catch (error: any) {
      triggerShakeAnimation();
      showNotification({
        type: "error",
        title: "Login Failed",
        message: error?.message || "An error occurred during login",
        confirmText: "Try Again",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const decodedToken = await loginWithGoogle();

      // Check if first time login (string "True" from API)
      if (decodedToken.FirstTime === "True") {
        showNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome! Let's get you started with onboarding.",
          showCancel: true,
          confirmText: "Start",
          cancelText: "Cancel",
          onConfirm: () => {
            navigation.replace("Onboarding");
          },
        });
      } else {
        showNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
          showCancel: false,
          confirmText: "Continue",
          onConfirm: () => {
            navigation.replace("Main");
          },
        });
      }
    } catch (error) {
      // Error already handled by useAuth with Alert
      console.log("Google login failed:", error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
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
            <View style={[styles.centerContainer, { marginBottom: 20 }]}>
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
                <Text style={styles.title}>Smart Outfit Planner</Text>
                <Text style={styles.subtitle}>
                  Style at your fingertips – Discover your personal style with smart AI.
                </Text>
              </Animated.View>
            </View>

            {/* Login Form Card with Glassmorphism */}
            <Animated.View style={[styles.formCard, formAnimatedStyle, shakeAnimatedStyle]}>
              <View style={styles.formInner}>
                <Text style={styles.formTitle}>Welcome Back!</Text>
                <Text style={styles.formSubtitle}>Sign in to continue</Text>

                {/* Email Input */}
                <View style={{ marginTop: 24, marginBottom: 16 }}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="mail-outline" size={20} color="#3b5998" />
                    </View>
                    <TextInput
                      placeholder="Email address"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 12 }}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#3b5998" />
                    </View>
                    <TextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#94A3B8"
                      style={styles.textInput}
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

                {/* Forgot Password */}
                <View style={[styles.rightAlign, { marginBottom: 24 }]}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button with Gradient */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.loginButtonContainer}
                >
                  <LinearGradient
                    colors={['#2c5282', '#1a365d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={[styles.rowCenter, { marginVertical: 24 }]}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Login Button */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.googleButton}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Register Link */}
            <View style={[styles.rowCenter, { marginTop: 24 }]}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign up now</Text>
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAlign: {
    alignItems: 'flex-end',
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
    // backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
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
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 4,
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
  forgotText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginButtonContainer: {
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
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },
  registerText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  registerLink: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
