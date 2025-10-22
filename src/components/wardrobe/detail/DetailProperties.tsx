import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DetailPropertiesProps {
  category?: string;
  color?: string;
  weather?: string[];
  fabric?: string;
  pattern?: string;
  aiDescription?: string;
}

export const DetailProperties: React.FC<DetailPropertiesProps> = ({
  category,
  color,
  weather = [],
  fabric,
  pattern,
  aiDescription,
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
          <View style={styles.colorRow}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: color.toLowerCase() },
              ]}
            />
            <Text style={styles.detailValue}>{color}</Text>
          </View>
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

      {aiDescription && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>AI Description</Text>
          <Text style={styles.description}>{aiDescription}</Text>
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
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
