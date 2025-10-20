import React from "react";
import { View, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface GradientIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  focused: boolean;
}

const GradientIcon = ({ name, size, focused }: GradientIconProps) => {
  if (!focused) {
    // Icon thường không có gradient
    return <Ionicons name={name} size={size} color="#8e8e93" />;
  }

  // Icon có gradient khi focused
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View style={styles.maskContainer}>
          <Ionicons name={name} size={size} color="white" />
        </View>
      }
    >
      <LinearGradient
        colors={["#30cfd0", "#330867"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskContainer: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GradientIcon;
