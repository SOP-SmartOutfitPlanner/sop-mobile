import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { CalenderAPI } from "../../services/endpoint/calendar";
import { GetOccasionsAPI } from "../../services/endpoint/occasion";
import { Occasion } from "../../types/occasion";

interface CreateOccasionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
  weatherSnapshot?: string;
}

const CreateOccasionModal: React.FC<CreateOccasionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialDate,
  weatherSnapshot = "",
}) => {
  // Form states
  const [occasionTypes, setOccasionTypes] = useState<Occasion[]>([]);
  const [selectedOccasionType, setSelectedOccasionType] = useState<Occasion | null>(null);
  const [showOccasionPicker, setShowOccasionPicker] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(initialDate || new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 8 * 60 * 60 * 1000)); // +8 hours

  // Picker visibility states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Loading states
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update date when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  // Fetch occasion types
  useEffect(() => {
    if (visible) {
      fetchOccasionTypes();
    }
  }, [visible]);

  const fetchOccasionTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const response = await GetOccasionsAPI({
        pageIndex: 1,
        pageSize: 100,
        takeAll: true,
      });
      if (response.statusCode === 200 && response.data?.data) {
        setOccasionTypes(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch occasion types:", err);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const resetForm = () => {
    setSelectedOccasionType(null);
    setName("");
    setDescription("");
    setDate(initialDate || new Date());
    setStartTime(new Date());
    setEndTime(new Date(Date.now() + 8 * 60 * 60 * 1000));
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedOccasionType) {
      setError("Please select an occasion type");
      return;
    }
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const startTimeStr = `${dateStr}T${format(startTime, "HH:mm:ss")}`;
      const endTimeStr = `${dateStr}T${format(endTime, "HH:mm:ss")}`;

      await CalenderAPI.createUserOccasion({
        occasionId: selectedOccasionType.id,
        name: name.trim(),
        description: description.trim(),
        dateOccasion: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        weatherSnapshot: weatherSnapshot,
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to create occasion:", err);
      setError(err?.response?.data?.message || "Failed to create occasion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate && event.type === "set") {
      setDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowStartTimePicker(false);
    }
    if (selectedTime && event.type === "set") {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowEndTimePicker(false);
    }
    if (selectedTime && event.type === "set") {
      setEndTime(selectedTime);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="sparkles" size={22} color="#22D3EE" />
              <Text style={styles.headerTitle}>Create New Occasion</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              {format(date, "EEEE, MMMM d, yyyy")}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Occasion Type */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <View style={styles.labelIndicator} />
                <Text style={styles.label}>Occasion Type *</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowOccasionPicker(!showOccasionPicker)}
                disabled={isLoadingTypes}
              >
                {isLoadingTypes ? (
                  <ActivityIndicator size="small" color="#22D3EE" />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.dropdownText,
                        !selectedOccasionType && styles.dropdownPlaceholder,
                      ]}
                    >
                      {selectedOccasionType?.name || "Select occasion type"}
                    </Text>
                    <Ionicons
                      name={showOccasionPicker ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </>
                )}
              </TouchableOpacity>
              {showOccasionPicker && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {occasionTypes.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.dropdownItem,
                          selectedOccasionType?.id === type.id && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedOccasionType(type);
                          setShowOccasionPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedOccasionType?.id === type.id && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {type.name}
                        </Text>
                        {selectedOccasionType?.id === type.id && (
                          <Ionicons name="checkmark" size={18} color="#22D3EE" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Name */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <View style={styles.labelIndicator} />
                <Text style={styles.label}>Name *</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Team Lunch, Birthday Party"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <View style={styles.labelIndicator} />
                <Text style={styles.label}>Description</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about this occasion..."
                placeholderTextColor="#6B7280"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Date */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <View style={styles.labelIndicator} />
                <Text style={styles.label}>Date *</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#22D3EE" />
                <Text style={styles.dateButtonText}>
                  {format(date, "MM/dd/yyyy")}
                </Text>
                <Ionicons name="calendar" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <Text style={styles.hint}>
                You can only create occasions for today or future dates
              </Text>
            </View>

            {/* Time Row */}
            <View style={styles.timeRow}>
              <View style={[styles.field, styles.timeField]}>
                <View style={styles.labelRow}>
                  <View style={styles.labelIndicator} />
                  <Text style={styles.label}>Start Time *</Text>
                </View>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={18} color="#22D3EE" />
                  <Text style={styles.timeButtonText}>
                    {format(startTime, "hh:mm a")}
                  </Text>
                  <Ionicons name="time" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View style={[styles.field, styles.timeField]}>
                <View style={styles.labelRow}>
                  <View style={styles.labelIndicator} />
                  <Text style={styles.label}>End Time *</Text>
                </View>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={18} color="#22D3EE" />
                  <Text style={styles.timeButtonText}>
                    {format(endTime, "hh:mm a")}
                  </Text>
                  <Ionicons name="time" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, isSubmitting && styles.createButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.createButtonText}>Create</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        Platform.OS === "ios" ? (
          <View style={styles.iosPickerOverlay}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.iosPickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.iosPickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.iosPickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor="#FFFFFF"
              />
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )
      )}

      {/* Start Time Picker */}
      {showStartTimePicker && (
        Platform.OS === "ios" ? (
          <View style={styles.iosPickerOverlay}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                  <Text style={styles.iosPickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.iosPickerTitle}>Start Time</Text>
                <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                  <Text style={styles.iosPickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                onChange={handleStartTimeChange}
                textColor="#FFFFFF"
              />
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={handleStartTimeChange}
          />
        )
      )}

      {/* End Time Picker */}
      {showEndTimePicker && (
        Platform.OS === "ios" ? (
          <View style={styles.iosPickerOverlay}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                  <Text style={styles.iosPickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.iosPickerTitle}>End Time</Text>
                <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                  <Text style={styles.iosPickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                onChange={handleEndTimeChange}
                textColor="#FFFFFF"
              />
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={handleEndTimeChange}
          />
        )
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "rgba(30, 41, 59, 0.98)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.2)",
  },
  // Header
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
    marginLeft: 32,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  // Content
  content: {
    padding: 20,
    maxHeight: 400,
  },
  field: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  labelIndicator: {
    width: 3,
    height: 14,
    backgroundColor: "#22D3EE",
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22D3EE",
  },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  // Dropdown
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dropdownText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  dropdownPlaceholder: {
    color: "#6B7280",
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(34, 211, 238, 0.1)",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  dropdownItemTextSelected: {
    color: "#22D3EE",
    fontWeight: "600",
  },
  // Date & Time
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  hint: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 6,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  timeButtonText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
  },
  // Error
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#EF4444",
  },
  // Footer
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#22D3EE",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // iOS Picker
  iosPickerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iosPickerContainer: {
    paddingBottom: 20,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  iosPickerCancel: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  iosPickerDone: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22D3EE",
  },
});

export default CreateOccasionModal;
