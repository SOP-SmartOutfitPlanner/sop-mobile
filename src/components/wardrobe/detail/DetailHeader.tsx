import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DetailHeaderProps {
  onClose: () => void;
  onEdit?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  onClose,
  onEdit,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <LinearGradient
      colors={["rgba(59,130,246,0.35)", "rgba(147,51,234,0.25)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.heroCard}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Item Details</Text>
          <Text style={styles.subtitle}>View your wardrobe item information</Text>
        </View>
        <View style={styles.headerRight}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={18} color="#3b82f6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color="#e5edff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5f5",
    marginTop: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(59,130,246,0.2)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.4)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#60a5fa",
  },
  closeButton: {
    padding: 8,
  },
});
