import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.outfitsContainer}
      >
        {/* Existing Outfits */}
        {outfits.map((outfit) => (
          <TouchableOpacity
            key={outfit.id}
            style={styles.outfitCard}
            onPress={() => onViewOutfit(outfit)}
          >
            <View style={styles.outfitItems}>
              {outfit.items.slice(0, 4).map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.circleItemContainer,
                    index === 0 && styles.topLeft,
                    index === 1 && styles.topRight,
                    index === 2 && styles.bottomLeft,
                    index === 3 && styles.bottomRight,
                  ]}
                >
                  {item ? (
                    <Image source={{ uri: item }} style={styles.circleItemImage} />
                  ) : (
                    <View style={styles.circleItemPlaceholder}>
                      <Ionicons name="shirt-outline" size={16} color="#cbd5e1" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
       
      </ScrollView>
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
    paddingRight: 16,
  },

  outfitCard: {
    width: 150,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
  },
  outfitItems: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  circleItemContainer: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  topLeft: {
    // Position for first item (top-left)
  },
  topRight: {
    // Position for second item (top-right)
  },
  bottomLeft: {
    // Position for third item (bottom-left)
  },
  bottomRight: {
    // Position for fourth item (bottom-right)
  },
  circleItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  circleItemPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
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
    width: 100,
    height: 100,
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
