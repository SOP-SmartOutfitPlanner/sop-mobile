import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DetailActionsProps {
  onUseInOutfit?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DetailActions: React.FC<DetailActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, styles.editButton]}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color="#60a5fa" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#f87171" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#050b1d",
    gap: 12,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderColor: "rgba(59,130,246,0.3)",
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#60a5fa",
  },
  deleteButton: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f87171",
  },
});
