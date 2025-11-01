import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { formatDateShort } from "../../../utils/dateUtils";

interface ReviewStepData {
  name: string;
  brand?: string;
  type: string;
  color?: string;
  aiDescription?: string;
  weatherSuitable?: string;
  condition?: string;
  pattern?: string;
  fabric?: string;
  lastWornAt?: string;
  frequencyWorn?: string;
  imageUri: string | null;
  styles?: string[];
  occasions?: string[];
  seasons?: string[];
}

interface ReviewStepProps {
  data: ReviewStepData;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const renderInfoRow = (label: string, value: string | string[]) => {
    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    return (
      <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue || "Not specified"}</Text>
      </View>
    );
  };

  const renderColorTags = (colors: string[]) => {
    return (
      <View style={styles.tagContainer}>
        {colors.map((color, index) => (
          <View
            key={index}
            style={[styles.colorTag, { backgroundColor: color }]}
          >
            <Text
              style={[
                styles.colorTagText,
                {
                  color:
                    color === "white" || color === "yellow"
                      ? "#1f2937"
                      : "#fff",
                },
              ]}
            >
              {color}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTags = (items: string[], backgroundColor: string, textColor: string = "#1f2937") => {
    return (
      <View style={styles.tagContainer}>
        {items.map((item, index) => (
          <View key={index} style={[styles.tag, { backgroundColor }]}>
            <Text style={[styles.tagText, { color: textColor }]}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Review Your Item</Text>
      <Text style={styles.subtitle}>
        Please review the details below before saving
      </Text>

      {/* Image */}
      {data.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.imageUri }} style={styles.image} />
        </View>
      )}

      {/* Item Details */}
      <View style={styles.section}>
        {renderInfoRow("ITEM NAME", data.name)}
        {data.brand && renderInfoRow("BRAND", data.brand)}
        {renderInfoRow("CATEGORY", data.type)}
        {data.color && renderInfoRow("COLOR", data.color)}
      </View>

      {/* AI Details */}
      {data.aiDescription && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI DESCRIPTION</Text>
          <Text style={styles.value}>{data.aiDescription}</Text>
        </View>
      )}

      {/* Additional Info */}
      <View style={styles.section}>
        {data.weatherSuitable && renderInfoRow("WEATHER", data.weatherSuitable)}
        {data.condition && renderInfoRow("CONDITION", data.condition)}
        {data.pattern && renderInfoRow("PATTERN", data.pattern)}
        {data.fabric && renderInfoRow("FABRIC", data.fabric)}
        {data.lastWornAt &&
          renderInfoRow("LAST WORN", formatDateShort(data.lastWornAt))}
        {data.frequencyWorn && renderInfoRow("FREQUENCY", data.frequencyWorn)}
      </View>

      {/* Styles, Occasions, and Seasons */}
      {data.styles && data.styles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STYLES</Text>
          {renderTags(data.styles, "#e0e7ff")}
        </View>
      )}

      {data.occasions && data.occasions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OCCASIONS</Text>
          {renderTags(data.occasions, "#fef3c7")}
        </View>
      )}

      {data.seasons && data.seasons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SEASONS</Text>
          {renderTags(data.seasons, "#dbeafe")}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  section: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  colorTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  colorTagText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
