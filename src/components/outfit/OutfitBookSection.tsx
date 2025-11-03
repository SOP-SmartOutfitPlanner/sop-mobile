import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Outfit {
  id: string;
  items: string[]; // Array of image URLs
  name?: string;
}

interface OutfitBookSectionProps {
  outfits: Outfit[];
  onCreateOutfit: () => void;
  onViewOutfit: (outfit: Outfit) => void;
}

export const OutfitBookSection: React.FC<OutfitBookSectionProps> = ({
  outfits,
  onCreateOutfit,
  onViewOutfit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfit Book</Text>

      <View style={styles.outfitsContainer}>
        {/* Add Outfit Button */}
        <TouchableOpacity style={styles.addButton} onPress={onCreateOutfit}>
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={32} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        {/* Existing Outfits */}
        {outfits.map((outfit) => (
          <TouchableOpacity
            key={outfit.id}
            style={styles.outfitCard}
            onPress={() => onViewOutfit(outfit)}
          >
            <View style={styles.outfitItems}>
              {outfit.items.slice(0, 2).map((item, index) => (
                <View key={index} style={styles.itemPreview}>
                  {item ? (
                    <Image source={{ uri: item }} style={styles.itemImage} />
                  ) : (
                    <View style={styles.itemPlaceholder}>
                      <Ionicons name="shirt-outline" size={24} color="#cbd5e1" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty Outfit Placeholder */}
        <TouchableOpacity
          style={styles.emptyOutfitCard}
          onPress={onCreateOutfit}
        >
          <Ionicons name="shirt-outline" size={32} color="#cbd5e1" />
          <Text style={styles.emptyText}>Create Outfit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  outfitsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  addButton: {
    width: 120,
    aspectRatio: 0.7,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  outfitCard: {
    width: 120,
    aspectRatio: 0.7,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  outfitItems: {
    flex: 1,
  },
  itemPreview: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyOutfitCard: {
    width: 120,
    aspectRatio: 0.7,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
