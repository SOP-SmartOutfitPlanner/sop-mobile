import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DetailPropertiesProps {
  category?: string;
  color?: string;
  weather?: string[];
  fabric?: string;
  pattern?: string;
  condition?: string;
  frequencyWorn?: string;
  brand?: string;
}

interface PropertyCardProps {
  label: string;
  value: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ label, value }) => (
  <View style={styles.propertyCard}>
    <Text style={styles.propertyLabel}>{label}</Text>
    <Text style={styles.propertyValue}>{value}</Text>
  </View>
);

export const DetailProperties: React.FC<DetailPropertiesProps> = ({
  category,
  weather = [],
  fabric,
  pattern,
  condition,
  frequencyWorn,
  brand,
}) => {
  const properties = [
    { label: "CATEGORY", value: category || "N/A" },
    { label: "BRAND", value: brand || "N/A" },
    { label: "FREQUENCY WORN", value: frequencyWorn || "N/A" },
    { label: "FABRIC", value: fabric || "N/A" },
    { label: "PATTERN", value: pattern || "N/A" },
    { label: "CONDITION", value: condition || "N/A" },
    { label: "WEATHER SUITABLE", value: weather.length > 0 ? weather.join(", ") : "N/A" },
  ].filter(prop => prop.value !== "N/A" || prop.label === "BRAND" || prop.label === "FREQUENCY WORN");

  if (properties.length === 0) return null;

  return (
    <View style={styles.detailsContainer}>
      {properties.map((prop, index) => (
        <PropertyCard key={index} label={prop.label} value={prop.value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    backgroundColor: "#050b1d",
    gap: 12,
  },
  propertyCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
  },
  propertyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  propertyValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f8fafc",
  },
});
