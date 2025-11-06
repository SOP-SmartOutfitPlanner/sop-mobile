import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useLocation } from "../../hooks/useLocation";

interface OnboardingStep1Props {
  navigation: any;
  onNext: (data: { gender: string; dob: string; location: string }) => void;
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
  navigation,
  onNext,
}) => {
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  // Location states
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  
  const {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    fetchDistricts,
    fetchWards,
  } = useLocation();

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    if (value) {
      fetchDistricts(value);
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard("");
    if (value) {
      fetchWards(value);
    }
  };

  const handleNext = () => {
    if (!gender || !selectedProvince) {
      return;
    }
    
    // Build location string from selected values
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || "";
    const districtName = selectedDistrict ? districts.find(d => d.id === selectedDistrict)?.name : "";
    const wardName = selectedWard ? wards.find(w => w.id === selectedWard)?.name : "";
    
    const locationParts = [wardName, districtName, provinceName].filter(Boolean);
    const location = locationParts.join(", ");
    
    // Format dob as YYYY-MM-DD
    const formattedDob = dob.toISOString().split('T')[0];
    onNext({ gender, dob: formattedDob, location });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const isFormValid = gender && selectedProvince;

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior="height"
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: "20%",
                  opacity: fadeAnim,
                }
              ]} 
            />
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="person" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>Help us personalize your experience</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.buttonGroup}>
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    gender === option && styles.optionButtonActive,
                  ]}
                  onPress={() => setGender(option)}
                  activeOpacity={0.7}
                >
                  {gender === option && (
                    <LinearGradient
                      colors={["#2563eb", "#1e40af"]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.optionText,
                      gender === option && styles.optionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.dateText}>
                {dob.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()} // Can't select future dates
              minimumDate={new Date(1900, 0, 1)} // Minimum year 1900
            />
          )}

            {/* Location */}
            <Text style={styles.label}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            
            {/* Province Dropdown */}
            <View style={styles.pickerContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#FFFFFF"
                style={styles.pickerIcon}
              />
              <Picker
                selectedValue={selectedProvince}
                onValueChange={handleProvinceChange}
                style={styles.picker}
                dropdownIconColor="#FFFFFF"
                enabled={!isLoadingProvinces}
              >
                <Picker.Item label="Select Province" value="" color="#999999" />
                {provinces.map((p) => (
                  <Picker.Item key={p.id} label={p.name} value={p.id} color="#FFFFFF" />
                ))}
              </Picker>
              {isLoadingProvinces && (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.pickerLoader} />
              )}
            </View>

            {/* District Dropdown */}
            {selectedProvince && (
              <View style={styles.pickerContainer}>
                <Ionicons
                  name="business-outline"
                  size={20}
                  color="#FFFFFF"
                  style={styles.pickerIcon}
                />
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={handleDistrictChange}
                  style={styles.picker}
                  dropdownIconColor="#FFFFFF"
                  enabled={!isLoadingDistricts && districts.length > 0}
                >
                  <Picker.Item label="Select District" value="" color="#999999" />
                  {districts.map((d) => (
                    <Picker.Item key={d.id} label={d.name} value={d.id} color="#FFFFFF" />
                  ))}
                </Picker>
                {isLoadingDistricts && (
                  <ActivityIndicator size="small" color="#FFFFFF" style={styles.pickerLoader} />
                )}
              </View>
            )}

            {/* Ward Dropdown */}
            {selectedDistrict && (
              <View style={styles.pickerContainer}>
                <Ionicons
                  name="home-outline"
                  size={20}
                  color="#FFFFFF"
                  style={styles.pickerIcon}
                />
                <Picker
                  selectedValue={selectedWard}
                  onValueChange={setSelectedWard}
                  style={styles.picker}
                  dropdownIconColor="#FFFFFF"
                  enabled={!isLoadingWards && wards.length > 0}
                >
                  <Picker.Item label="Select Ward (Optional)" value="" color="#ffffffff" />
                  {wards.map((w) => (
                    <Picker.Item key={w.id} label={w.name} value={w.id} color="#FFFFFF" />
                  ))}
                </Picker>
                {isLoadingWards && (
                  <ActivityIndicator size="small" color="#FFFFFF" style={styles.pickerLoader} />
                )}
              </View>
            )}
          
          </Animated.View>

          {/* Next Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity
              style={[styles.nextButton, !isFormValid && styles.disabledButton]}
              onPress={handleNext}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isFormValid ? ["#193C9E", "#1e40af"] : ["#1e3a5f", "#152238"]}
                style={styles.nextButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#193C9E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1e40af",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    overflow: "hidden",
  },
  optionButtonActive: {
    borderColor: "#193C9E",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  nextButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
  },
  required: {
    color: "#EF4444",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 52,
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    color: "#FFFFFF",
    marginRight: -10,
  },
  pickerLoader: {
    position: "absolute",
    right: 16,
  },
  helperText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 24,
    fontStyle: "italic",
  },
});
