import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* Base gradient background */}
      <LinearGradient
        colors={["#0F172A", "#1E3A8A", "#0F172A"]} // slate-900 → blue-900 → slate-900
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated gradient mesh circles */}
      {/* Top-left circle - blue to cyan */}
      <View>
        <LinearGradient
          colors={["rgba(59, 130, 246, 0.4)", "rgba(6, 182, 212, 0.4)"]} // blue-500/40 to cyan-500/40
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Bottom-right circle - indigo to purple */}
      <View>
        <LinearGradient
          colors={["rgba(99, 102, 241, 0.3)", "rgba(168, 85, 247, 0.3)"]} // indigo-500/30 to purple-500/30
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Center circle - teal to blue */}
      <View>
        <LinearGradient
          colors={["rgba(20, 184, 166, 0.2)", "rgba(59, 130, 246, 0.2)"]} // teal-500/20 to blue-500/20
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});

export default AnimatedBackground;
