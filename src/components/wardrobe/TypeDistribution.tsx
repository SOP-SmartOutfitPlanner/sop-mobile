import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  TypeDistribution as TypeDistributionType,
  PopularColor,
} from "../../types";

interface TypeDistributionProps {
  typeData: TypeDistributionType[];
  colorData: PopularColor[];
}

export const TypeDistribution: React.FC<TypeDistributionProps> = ({
  typeData,
  colorData,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tops":
        return "shirt-outline";
      case "bottoms":
        return "walk-outline";
      case "dresses":
        return "woman-outline";
      case "jackets":
        return "ice-cream-outline";
      case "shoes":
        return "footsteps-outline";
      case "accessories":
        return "watch-outline";
      default:
        return "shirt-outline";
    }
  };

  const typeColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Distribution & Colors</Text>
        <TouchableOpacity>
          <Ionicons name="pie-chart-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Type Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        <View style={styles.typeList}>
          {typeData.map((item, index) => (
            <View key={item.type} style={styles.typeItem}>
              <View style={styles.typeInfo}>
                <View
                  style={[
                    styles.typeIcon,
                    {
                      backgroundColor: `${
                        typeColors[index % typeColors.length]
                      }20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={getTypeIcon(item.type) as any}
                    size={16}
                    color={typeColors[index % typeColors.length]}
                  />
                </View>
                <View style={styles.typeText}>
                  <Text style={styles.typeName}>{item.type}</Text>
                  <Text style={styles.typeCount}>{item.count} items</Text>
                </View>
              </View>

              <View style={styles.percentageContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: typeColors[index % typeColors.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentage}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Color Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Colors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorList}>
            {colorData.map((color) => (
              <View key={color.color} style={styles.colorItem}>
                <View style={styles.colorCircle}>
                  <View
                    style={[
                      styles.colorSwatch,
                      {
                        backgroundColor: color.hex,
                        borderColor:
                          color.hex === "#FFFFFF" ? "#e5e7eb" : "transparent",
                      },
                    ]}
                  />
                  <View style={styles.colorCount}>
                    <Text style={styles.colorCountText}>{color.count}</Text>
                  </View>
                </View>
                <Text style={styles.colorName}>{color.color}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  typeList: {
    gap: 12,
  },
  typeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  typeText: {
    flex: 1,
  },
  typeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    textTransform: "capitalize",
  },
  typeCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  percentage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    width: 28,
    textAlign: "right",
  },
  colorList: {
    flexDirection: "row",
    paddingHorizontal: 4,
    gap: 16,
  },
  colorItem: {
    alignItems: "center",
  },
  colorCircle: {
    position: "relative",
    marginBottom: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  colorCount: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  colorCountText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  colorName: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "capitalize",
  },
});
