import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

interface ReviewStepData {
  name: string;
  brand?: string;
  type: string;
  colors: string[];
  seasons: string[];
  occasions: string[];
  imageUri: string | null;
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

  const renderTags = (items: string[], color: string) => {
    return (
      <View style={styles.tagContainer}>
        {items.map((item, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: color }]}>
            <Text style={styles.tagText}>{item}</Text>
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
        {renderInfoRow("BRAND", data.brand || "")}
        {renderInfoRow("TYPE", data.type)}
      </View>

      {/* Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>COLORS</Text>
        {renderColorTags(data.colors)}
      </View>

      {/* Seasons */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SEASONS</Text>
        {renderTags(data.seasons, "#dbeafe")}
      </View>

      {/* Occasions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>OCCASIONS</Text>
        {renderTags(data.occasions, "#dbeafe")}
      </View>
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
    color: "#3b82f6",
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
