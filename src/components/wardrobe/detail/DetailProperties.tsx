import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorDisplay } from "../ColorDisplay";

interface DetailPropertiesProps {
  category?: string;
  color?: string;
  weather?: string[];
  fabric?: string;
  pattern?: string;
}

export const DetailProperties: React.FC<DetailPropertiesProps> = ({
  category,
  color,
  weather = [],
  fabric,
  pattern,
}) => {
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.sectionTitle}>Details</Text>

      {category && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{category}</Text>
        </View>
      )}

      {color && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Color:</Text>
          <ColorDisplay colorString={color} size="small" />
        </View>
      )}

      {weather.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weather:</Text>
          <Text style={styles.detailValue}>{weather.join(", ")}</Text>
        </View>
      )}

      {fabric && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fabric:</Text>
          <Text style={styles.detailValue}>{fabric}</Text>
        </View>
      )}

      {pattern && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pattern:</Text>
          <Text style={styles.detailValue}>{pattern}</Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "400",
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});
