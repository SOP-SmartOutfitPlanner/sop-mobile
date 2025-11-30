import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonsProps {
  onSave: () => void;
  onShare?: () => void;
  onUseToday?: () => void;
  isSaving?: boolean;
  isUsingToday?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSave, 
  onShare, 
  onUseToday,
  isSaving = false,
  isUsingToday = false,
}) => {
  const isDisabled = isSaving || isUsingToday;

  // If onUseToday is provided, show both "Add to My Outfit" and "Use Outfit Today"
  // Otherwise, show "Add to Wardrobe" and "Share"
  if (onUseToday) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.addToOutfitButton, isDisabled && styles.buttonDisabled]} 
          onPress={onSave}
          disabled={isDisabled}
        >
          <Ionicons name={isSaving ? "hourglass-outline" : "shirt-outline"} size={20} color="#FFFFFF" />
          <Text style={styles.addToOutfitButtonText}>
            {isSaving ? "Adding..." : "Add to My Outfit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.useTodayButton, isDisabled && styles.buttonDisabled]} 
          onPress={onUseToday}
          disabled={isDisabled}
        >
          <Ionicons name={isUsingToday ? "hourglass-outline" : "calendar-outline"} size={20} color="#FFFFFF" />
          <Text style={styles.useTodayButtonText}>
            {isUsingToday ? "Setting up..." : "Use Outfit Today"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback: Show Save and Share buttons
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.saveButton, isDisabled && styles.buttonDisabled]} 
        onPress={onSave}
        disabled={isDisabled}
      >
        <Ionicons name={isSaving ? "hourglass-outline" : "heart-outline"} size={20} color="#64748B" />
        <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Add to Wardrobe"}</Text>
      </TouchableOpacity>
      {onShare && (
      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Ionicons name="share-outline" size={20} color="#64748B" />
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addToOutfitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addToOutfitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  useTodayButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  useTodayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ActionButtons;
