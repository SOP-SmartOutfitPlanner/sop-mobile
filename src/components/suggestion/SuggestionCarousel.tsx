import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SuggestionCarouselProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

const SuggestionCarousel: React.FC<SuggestionCarouselProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.arrowButton} onPress={onPrevious}>
        <Ionicons name="chevron-back" size={24} color="#64748B" />
      </TouchableOpacity>
      <View style={styles.indicator}>
        <Text style={styles.title}>Main Suggestion</Text>
        <View style={styles.dots}>
          {Array.from({ length: totalItems }).map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.arrowButton} onPress={onNext}>
        <Ionicons name="chevron-forward" size={24} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  activeDot: {
    backgroundColor: "#6366F1",
    width: 24,
  },
});

export default SuggestionCarousel;
