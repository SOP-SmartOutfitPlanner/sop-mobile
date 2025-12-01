import React from "react";
import { View, StyleSheet } from "react-native";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  currentIndex,
}) => {
  if (total <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#8B5CF6",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});

export default PaginationDots;

