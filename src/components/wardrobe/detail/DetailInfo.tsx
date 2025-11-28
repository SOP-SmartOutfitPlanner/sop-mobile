import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorDisplay } from "../ColorDisplay";

interface DetailInfoProps {
  name: string;
  brand?: string;
  color?: string;
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  name,
  brand,
  color,
}) => {
  return (
    <View style={styles.infoSection}>
      {/* Name Field */}
      <View style={styles.nameField}>
        <Text style={styles.nameLabel}>NAME</Text>
        <View style={styles.nameInput}>
          <Text style={styles.itemName}>{name}</Text>
        </View>
      </View>

      {/* Colors Section */}
      {color && (
        <View style={styles.colorsSection}>
          <Text style={styles.colorsLabel}>COLORS</Text>
          <View style={styles.colorsContainer}>
            <ColorDisplay 
              colorString={color} 
              size="medium" 
              showText={false}
              maxDisplay={5}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    padding: 16,
    backgroundColor: "#050b1d",
    gap: 20,
  },
  nameField: {
    gap: 8,
  },
  nameLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nameInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
  },
  colorsSection: {
    gap: 12,
  },
  colorsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
