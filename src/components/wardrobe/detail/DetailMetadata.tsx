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
    textColor: string,
    borderColor: string
  ) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{title}</Text>
        <View style={styles.tagContainer}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { 
                  backgroundColor,
                  borderColor,
                }
              ]}
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
      {renderTags(
        "STYLES", 
        stylesList, 
        "rgba(59,130,246,0.2)", 
        "#3b82f6",
        "rgba(59,130,246,0.3)"
      )}
      {renderTags(
        "OCCASIONS", 
        occasions, 
        "rgba(147,51,234,0.2)", 
        "#f8fafc",
        "rgba(147,51,234,0.3)"
      )}
      {renderTags(
        "SEASONS", 
        seasons, 
        "rgba(59,130,246,0.2)", 
        "#3b82f6",
        "rgba(59,130,246,0.3)"
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#050b1d",
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
