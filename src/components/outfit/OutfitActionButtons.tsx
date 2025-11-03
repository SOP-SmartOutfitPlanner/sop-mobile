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
              color={button.isActive ? "#fff" : "#64748b"}
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
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainerActive: {
    backgroundColor: "#1e293b",
  },
  buttonText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },
  buttonTextActive: {
    color: "#1e293b",
    fontWeight: "600",
  },
});
