import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DetailMetadataProps {
  stylesList?: string[];
  occasions?: string[];
  seasons?: string[];
}

export const DetailMetadata: React.FC<DetailMetadataProps> = ({
  stylesList = [],
  occasions = [],
  seasons = [],
}) => {
  const renderTags = (
    title: string,
    items: string[],
    backgroundColor: string,
    textColor: string = "#1f2937"
  ) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{title}</Text>
        <View style={styles.tagContainer}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor }]}
            >
              <Text style={[styles.tagText, { color: textColor }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Don't render anything if all arrays are empty
  if (stylesList.length === 0 && occasions.length === 0 && seasons.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {renderTags("STYLES", stylesList, "#e0e7ff", "#4338ca")}
      {renderTags("OCCASIONS", occasions, "#fef3c7", "#92400e")}
      {renderTags("SEASONS", seasons, "#dbeafe", "#1e40af")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderBottomColor: "#f9fafb",
  },
  section: {
    marginBottom: 16,
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
});
