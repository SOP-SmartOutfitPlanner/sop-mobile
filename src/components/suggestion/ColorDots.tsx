import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Color {
  hex: string;
  name: string;
}

interface ColorDotsProps {
  colors: Color[];
  maxDisplay?: number;
}

const ColorDots: React.FC<ColorDotsProps> = ({ colors, maxDisplay = 6 }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const displayColors = colors.slice(0, maxDisplay);
  const remainingCount = colors.length - maxDisplay;

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {displayColors.map((color, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: color.hex },
            ]}
          />
        ))}
        {remainingCount > 0 && (
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  remainingText: {
    fontSize: 10,
    color: "#94A3B8",
    marginLeft: 2,
  },
});

export default ColorDots;

