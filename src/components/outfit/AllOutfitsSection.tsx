import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AllOutfitCard, AllOutfitCardData } from "./AllOutfitCard";

interface AllOutfitsSectionProps {
  outfits: AllOutfitCardData[];
  onViewOutfit: (outfitId: string) => void;
  title?: string;
  emptyMessage?: string;
}

export const AllOutfitsSection: React.FC<AllOutfitsSectionProps> = ({
  outfits,
  onViewOutfit,
  title = "All Outfits",
  emptyMessage = "There are no outfits to display",
}) => {
  if (outfits.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.count}>0 outfits</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={32} color="#cbd5e1" />
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.count}>{outfits.length} outfits</Text>
      </View>

      <View style={styles.cardsGrid}>
        {outfits.map((outfit) => (
          <AllOutfitCard key={outfit.id} outfit={outfit} onPress={onViewOutfit} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  count: {
    fontSize: 14,
    color: "#64748b",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
    textAlign: "center",
  },
});
