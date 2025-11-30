import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetOccasionsAPI } from "../../services/endpoint/occasion";
import { Occasion } from "../../types/occasion";

interface OccasionDropdownProps {
  value: string;
  onSelect: (occasion: string) => void;
}

const OccasionDropdown: React.FC<OccasionDropdownProps> = ({ value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch occasions from API
  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        setIsLoading(true);
        const response = await GetOccasionsAPI({
          pageIndex: 1,
          pageSize: 100,
          takeAll: true,
        });

        if (response.statusCode === 200 && response.data?.data) {
          setOccasions(response.data.data);
          // Set default value to first occasion if not set
          if (!value && response.data.data.length > 0) {
            onSelect(response.data.data[0].name);
          }
        } else {
          throw new Error(response.message || "Failed to fetch occasions");
        }
      } catch (err: any) {
        console.error("Failed to fetch occasions:", err);
        setError(err.message || "Failed to load occasions");
        // Fallback to default occasions if API fails
        const fallbackOccasions: Occasion[] = [
          { id: 1, name: "Casual", createdDate: "", updatedDate: null },
          { id: 2, name: "Date", createdDate: "", updatedDate: null },
          { id: 3, name: "Home", createdDate: "", updatedDate: null },
          { id: 4, name: "Vacation", createdDate: "", updatedDate: null },
          { id: 5, name: "Sport", createdDate: "", updatedDate: null },
          { id: 6, name: "Formal", createdDate: "", updatedDate: null },
          { id: 7, name: "Work", createdDate: "", updatedDate: null },
          { id: 8, name: "Party", createdDate: "", updatedDate: null },
        ];
        setOccasions(fallbackOccasions);
        if (!value) {
          onSelect("Casual");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccasions();
  }, []);

  const handleSelect = (occasionName: string) => {
    onSelect(occasionName);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="star" size={16} color="#FCD34D" style={styles.starIcon} />
        <Text style={styles.dropdownText} numberOfLines={1}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Occasion</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Loading occasions...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={occasions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      value === item.name && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item.name)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === item.name && styles.selectedOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {value === item.name && (
                      <Ionicons name="checkmark" size={20} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  starIcon: {
    marginRight: 0,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  selectedOption: {
    backgroundColor: "#F0F9FF",
  },
  optionText: {
    fontSize: 16,
    color: "#1E293B",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#6366F1",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
});

export default OccasionDropdown;

