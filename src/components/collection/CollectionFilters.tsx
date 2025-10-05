import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CollectionFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const filters = ["Filters", "Spring", "Summer", "Fall", "Winter", "Autumn"];

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleScrollLeft}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#64748B" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
              ]}
              onPress={() => onFilterChange(filter)}
            >
              {index === 0 && (
                <Ionicons
                  name="filter-outline"
                  size={16}
                  color={activeFilter === filter ? "#6366F1" : "#64748B"}
                  style={styles.filterIcon}
                />
              )}
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleScrollRight}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  activeFilterChip: {
    borderColor: "#6366F1",
    backgroundColor: "#F0F0FF",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  activeFilterText: {
    color: "#6366F1",
    fontWeight: "600",
  },
});

export default CollectionFilters;
