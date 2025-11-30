import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButton {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

interface OutfitActionButtonsProps {
  onCreateOutfit: () => void;
  onAddToCalendar: () => void;
}

export const OutfitActionButtons: React.FC<OutfitActionButtonsProps> = ({
  onCreateOutfit,
  onAddToCalendar,
}) => {
  const buttons: ActionButton[] = [
    {
      id: "create",
      icon: "shirt-outline",
      label: "Create Outfit",
      onPress: onCreateOutfit,
      isActive: true,
    },
    {
      id: "calendar",
      icon: "calendar-outline",
      label: "Add to Calendar",
      onPress: onAddToCalendar,
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.id}
          style={[
            styles.button,
            button.isActive && styles.buttonActive,
          ]}
          onPress={button.onPress}
        >
          <View
            style={[
              styles.iconContainer,
              button.isActive && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name={button.icon}
              size={24}
              color={button.isActive ? "#ffffff" : "#94a3b8"}
            />
          </View>
          <Text
            style={[
              styles.buttonText,
              button.isActive && styles.buttonTextActive,
            ]}
            numberOfLines={2}
          >
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    alignItems: "center",
    marginRight: 12,
    minWidth: 90,
  },
  buttonActive: {
    // Active state styling handled by iconContainer
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(224,242,254,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainerActive: {
    backgroundColor: "#1e3a8a",
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 12,
    color: "rgba(226,232,240,0.7)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },
  buttonTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
