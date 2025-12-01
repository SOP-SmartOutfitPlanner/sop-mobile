import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export type SortOption = "newest" | "oldest" | "name" | "items";
export type FilterOption = "all" | "favorites" | "recent";

interface OutfitFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: FilterOption, sort: SortOption) => void;
  currentFilter?: FilterOption;
  currentSort?: SortOption;
}

const FILTER_OPTIONS: { value: FilterOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "all", label: "All Outfits", icon: "grid-outline" },
  { value: "favorites", label: "Favorites Only", icon: "heart-outline" },
  { value: "recent", label: "Recent", icon: "time-outline" },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "newest", label: "Newest First", icon: "arrow-down-outline" },
  { value: "oldest", label: "Oldest First", icon: "arrow-up-outline" },
  { value: "name", label: "Name (A-Z)", icon: "text-outline" },
  { value: "items", label: "Most Items", icon: "layers-outline" },
];

export const OutfitFilterModal: React.FC<OutfitFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter = "all",
  currentSort = "newest",
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(currentFilter);
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);

  const handleApply = () => {
    onApply(selectedFilter, selectedSort);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilter("all");
    setSelectedSort("newest");
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient
          colors={["#1f2b88", "#0e133a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.headerTitle}>Filter & Sort</Text>
              <Text style={styles.headerSubtitle}>Customize your outfit view</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Filter Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filter</Text>
            <View style={styles.optionsContainer}>
              {FILTER_OPTIONS.map((option) => {
                const isSelected = selectedFilter === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedFilter(option.value)}
                  >
                    <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={isSelected ? "#fff" : "#64748b"}
                      />
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sort Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.optionsContainer}>
              {SORT_OPTIONS.map((option) => {
                const isSelected = selectedSort === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedSort(option.value)}
                  >
                    <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={isSelected ? "#fff" : "#64748b"}
                      />
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "rgba(226, 232, 240, 0.9)",
    fontSize: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  optionCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconSelected: {
    backgroundColor: "#3b82f6",
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  optionLabelSelected: {
    color: "#0f172a",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});

