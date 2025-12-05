import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CalenderAPI } from "../../services/endpoint/calendar";
import { Occasion } from "../../types/occasion";
import { CreateUserOccasionRequest, UserOccasion } from "../../types/userOccasion";

interface AddOccasionModalProps {
  visible: boolean;
  selectedDate: Date | null;
  onClose: () => void;
  onSuccess: (userOccasionId: number) => void;
  onCreateOccasion?: (data: CreateUserOccasionRequest) => Promise<UserOccasion | null>;
}

export const AddOccasionModal: React.FC<AddOccasionModalProps> = ({
  visible,
  selectedDate,
  onClose,
  onSuccess,
  onCreateOccasion,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOccasions, setLoadingOccasions] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    occasionId?: string;
    endTime?: string;
    date?: string;
  }>({});

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  const isPastSelectedDate = useMemo(() => {
    if (!selectedDate) return false;
    return isDateInPast(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (visible) {
      fetchOccasions();
      // Set default times based on selected date
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split("T")[0];
        setStartTime(`${dateStr}T09:00:00`);
        setEndTime(`${dateStr}T17:00:00`);
      }
      if (isPastSelectedDate) {
        setErrors((prev) => ({
          ...prev,
          date: "Cannot create an occasion for a past date",
        }));
      } else {
        setErrors((prev) => {
          const { date, ...rest } = prev;
          return rest;
        });
      }
    } else {
      // Reset form when modal closes
      setName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setSelectedOccasionId(null); // Will be required, so reset to null
      setErrors({});
    }
  }, [visible, selectedDate, isPastSelectedDate]);

  const fetchOccasions = async () => {
    try {
      setLoadingOccasions(true);
      const response = await CalenderAPI.getOccasions({
        PageIndex: 1,
        PageSize: 10,
        takeAll: true,
      });
      if (response.statusCode === 200 && response.data?.data) {
        setOccasions(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch occasions:", error);
    } finally {
      setLoadingOccasions(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!selectedOccasionId) {
      newErrors.occasionId = "Occasion type is required";
    }
    if (isPastSelectedDate) {
      newErrors.date = "Cannot create an occasion for a past date";
    }
    // startTime and endTime are optional, but if both are provided, validate endTime > startTime
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedDate) return;

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      // selectedOccasionId is guaranteed to be non-null after validation
      const request: CreateUserOccasionRequest = {
        occasionId: selectedOccasionId!,
        name: name.trim(),
        description: description.trim() || "",
        dateOccasion: dateStr,
        startTime: startTime || "", // Optional - empty string if not provided
        endTime: endTime || "", // Optional - empty string if not provided
        weatherSnapshot: "", // Can be enhanced later
      };

      let userOccasion: UserOccasion | null = null;
      
      if (onCreateOccasion) {
        // Use hook function (with notification)
        userOccasion = await onCreateOccasion(request);
        
        if (userOccasion) {
          // Wait a bit for notification to show, then close modal and refresh
          setTimeout(() => {
            onSuccess(userOccasion!.id);
            onClose();
          }, 500);
        }
      } else {
        // Fallback to direct API call (no notification)
        const response = await CalenderAPI.createUserOccasion(request);
        // Accept both 200 (OK) and 201 (Created) as success
        if (response.statusCode === 201 && response.data) {
          userOccasion = response.data;
          onSuccess(userOccasion.id);
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Failed to create occasion:", error);
      setErrors({ name: error.message || "Failed to create occasion" });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return "";
    try {
      const date = new Date(dateTime);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateTime;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Add Occasion</Text>
            <Text style={styles.headerSubtitle}>
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {errors.date && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#fecdd3" />
            <Text style={styles.errorBannerText}>{errors.date}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Occasion Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Occasion Type <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionSubtitle}>
              Select a predefined occasion type
            </Text>
            {loadingOccasions ? (
              <ActivityIndicator size="small" color="#38bdf8" />
            ) : occasions.length === 0 ? (
              <View style={styles.emptyOccasionsContainer}>
                <Text style={styles.emptyOccasionsText}>
                  No occasions available. Please contact support.
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.occasionsScroll}
                contentContainerStyle={styles.occasionsContainer}
              >
                {occasions.map((occasion) => (
                  <TouchableOpacity
                    key={occasion.id}
                    style={[
                      styles.occasionChip,
                      selectedOccasionId === occasion.id && styles.occasionChipSelected,
                      errors.occasionId && !selectedOccasionId && styles.occasionChipError,
                    ]}
                    onPress={() => {
                      setSelectedOccasionId(occasion.id);
                      if (errors.occasionId) {
                        setErrors({ ...errors, occasionId: undefined });
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.occasionChipText,
                        selectedOccasionId === occasion.id && styles.occasionChipTextSelected,
                      ]}
                    >
                      {occasion.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {errors.occasionId && (
              <Text style={styles.errorText}>{errors.occasionId}</Text>
            )}
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter occasion name"
              placeholderTextColor="rgba(148,163,184,0.5)"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea, styles.input]}
              placeholder="Enter description (optional)"
              placeholderTextColor="rgba(148,163,184,0.5)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Start Time */}
          <View style={styles.section}>
            <Text style={styles.label}>Start Time</Text>
            <Text style={styles.sectionSubtitle}>
              Optional - When does this occasion start?
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.timeInput]}
              onPress={() => {
                // In a real app, you'd use a DateTimePicker here
                // For now, we'll use a simple text input
              }}
            >
              <Ionicons name="time-outline" size={20} color="#94a3b8" />
              <Text style={styles.timeText}>
                {startTime ? formatDateTime(startTime) : "Select start time (optional)"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.hiddenInput}
              value={startTime}
              onChangeText={(text) => {
                setStartTime(text);
                // Clear endTime error if startTime changes and validation passes
                if (errors.endTime && text && endTime) {
                  const newStart = new Date(text);
                  const newEnd = new Date(endTime);
                  if (newStart < newEnd) {
                    setErrors({ ...errors, endTime: undefined });
                  }
                }
              }}
              placeholder="YYYY-MM-DDTHH:mm:ss"
              placeholderTextColor="rgba(148,163,184,0.5)"
            />
          </View>

          {/* End Time */}
          <View style={styles.section}>
            <Text style={styles.label}>End Time</Text>
            <Text style={styles.sectionSubtitle}>
              Optional - When does this occasion end?
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.timeInput, errors.endTime && styles.inputError]}
              onPress={() => {
                // In a real app, you'd use a DateTimePicker here
              }}
            >
              <Ionicons name="time-outline" size={20} color="#94a3b8" />
              <Text style={styles.timeText}>
                {endTime ? formatDateTime(endTime) : "Select end time (optional)"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.hiddenInput}
              value={endTime}
              onChangeText={(text) => {
                setEndTime(text);
                if (errors.endTime) {
                  // Re-validate if startTime exists
                  if (startTime && text) {
                    const newStart = new Date(startTime);
                    const newEnd = new Date(text);
                    if (newStart < newEnd) {
                      setErrors({ ...errors, endTime: undefined });
                    } else {
                      setErrors({ ...errors, endTime: "End time must be after start time" });
                    }
                  } else {
                    setErrors({ ...errors, endTime: undefined });
                  }
                }
              }}
              placeholder="YYYY-MM-DDTHH:mm:ss"
              placeholderTextColor="rgba(148,163,184,0.5)"
            />
            {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (loading || isPastSelectedDate) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || isPastSelectedDate}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Create Occasion</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030617",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.2)",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(226,232,240,0.7)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.6)",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeText: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(248,113,113,0.15)",
    borderColor: "rgba(248,113,113,0.4)",
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  errorBannerText: {
    color: "#fecdd3",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  occasionsScroll: {
    marginTop: 8,
  },
  occasionsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  occasionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  occasionChipSelected: {
    backgroundColor: "rgba(56,189,248,0.2)",
    borderColor: "#38bdf8",
  },
  occasionChipError: {
    borderColor: "#ef4444",
  },
  occasionChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  occasionChipTextSelected: {
    color: "#38bdf8",
  },
  emptyOccasionsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    marginTop: 8,
  },
  emptyOccasionsText: {
    fontSize: 13,
    color: "rgba(226,232,240,0.7)",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.2)",
    backgroundColor: "#030617",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "rgba(15,23,42,0.6)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#38bdf8",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

