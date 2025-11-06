import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";
import { runOnJS } from "react-native-reanimated";

interface ColorOption {
  name: string;
  hex: string;
  display: string;
}

const colorOptions: ColorOption[] = [
  { name: "Black", hex: "#000000", display: "⚫" },
  { name: "White", hex: "#FFFFFF", display: "⚪" },
  { name: "Red", hex: "#EF4444", display: "🔴" },
  { name: "Blue", hex: "#3B82F6", display: "🔵" },
  { name: "Green", hex: "#10B981", display: "🟢" },
  { name: "Yellow", hex: "#F59E0B", display: "🟡" },
  { name: "Purple", hex: "#8B5CF6", display: "🟣" },
  { name: "Orange", hex: "#F97316", display: "🟠" },
  { name: "Brown", hex: "#92400E", display: "🟤" },
  { name: "Gray", hex: "#6B7280", display: "⚫" },
  { name: "Navy", hex: "#1E3A8A", display: "🔵" },
];

interface OnboardingStep4Props {
  navigation: any;
  onNext: (data: { preferedColor: string[]; avoidedColor: string[] }) => void;
  onBack: () => void;
}

export const OnboardingStep4: React.FC<OnboardingStep4Props> = ({
  navigation,
  onNext,
  onBack,
}) => {
  const [preferedColor, setPreferedColor] = useState<string[]>([]);
  const [avoidedColor, setAvoidedColor] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<ColorOption[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<"preferred" | "avoided">("preferred");
  const [selectedColor, setSelectedColor] = useState("#FF5733");

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Callback for color selection
  const onSelectColor = (colors: { hex: string }) => {
    'worklet';
    runOnJS(setSelectedColor)(colors.hex);
  };

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

  const handleColorSelect = (type: "preferred" | "avoided", color: string) => {
    if (type === "preferred") {
      // Toggle color selection
      if (preferedColor.includes(color)) {
        // Remove color if already selected
        setPreferedColor(preferedColor.filter(c => c !== color));
      } else {
        // Add color and remove from avoided if present
        if (avoidedColor.includes(color)) {
          setAvoidedColor(avoidedColor.filter(c => c !== color));
        }
        setPreferedColor([...preferedColor, color]);
      }
    } else {
      // Toggle color selection for avoided
      if (avoidedColor.includes(color)) {
        // Remove color if already selected
        setAvoidedColor(avoidedColor.filter(c => c !== color));
      } else {
        // Add color and remove from preferred if present
        if (preferedColor.includes(color)) {
          setPreferedColor(preferedColor.filter(c => c !== color));
        }
        setAvoidedColor([...avoidedColor, color]);
      }
    }
  };

  const handleAddCustomColor = () => {
    // Check if color already exists
    const colorExists = customColors.some(c => c.hex.toLowerCase() === selectedColor.toLowerCase());
    
    if (!colorExists) {
      // Add to custom colors list
      const newColor: ColorOption = {
        name: selectedColor.toUpperCase(),
        hex: selectedColor,
        display: "🎨"
      };
      setCustomColors([...customColors, newColor]);
    }
    
    handleColorSelect(colorPickerType, selectedColor);
    setShowColorPicker(false);
  };

  const handleOpenColorPicker = (type: "preferred" | "avoided") => {
    setColorPickerType(type);
    setShowColorPicker(true);
  };

  const handleContinue = () => {
    if (preferedColor.length > 0 && avoidedColor.length > 0) {
      onNext({ preferedColor, avoidedColor });
    }
  };

  return (
    <LinearGradient colors={["#0a1628", "#152238"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: "100%",
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
                <Ionicons name="color-palette" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>What colors do you love?</Text>
            <Text style={styles.subtitle}>Help us personalize your style</Text>
          </Animated.View>

          {/* Preferred Color Section */}
          <Animated.View 
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>
              Preferred Colors {preferedColor.length > 0 && `(${preferedColor.length})`}
            </Text>
          </View>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => {
              const isSelected = preferedColor.includes(color.name);
              const isDisabled = avoidedColor.includes(color.name);
              return (
                <TouchableOpacity
                  key={`preferred-${color.name}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelected,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("preferred", color.name)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                      color.name === "White" && styles.whiteCircle,
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            
            {/* Custom Colors - Preferred */}
            {customColors.map((color) => {
              const isSelected = preferedColor.includes(color.hex);
              const isDisabled = avoidedColor.includes(color.hex);
              return (
                <TouchableOpacity
                  key={`preferred-custom-${color.hex}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelected,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("preferred", color.hex)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.display}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            
            {/* Add Custom Color Button - Preferred */}
            <TouchableOpacity
              style={styles.addColorButton}
              onPress={() => handleOpenColorPicker("preferred")}
            >
              <Ionicons name="add-circle" size={32} color="#10B981" />
              <Text style={styles.addColorText}>Custom</Text>
            </TouchableOpacity>
          </View>
          </Animated.View>

          {/* Avoided Color Section */}
          <Animated.View 
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
          <View style={styles.sectionHeader}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>
              Avoided Colors {avoidedColor.length > 0 && `(${avoidedColor.length})`}
            </Text>
          </View>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => {
              const isSelected = avoidedColor.includes(color.name);
              const isDisabled = preferedColor.includes(color.name);
              return (
                <TouchableOpacity
                  key={`avoided-${color.name}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelectedAvoided,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("avoided", color.name)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                      color.name === "White" && styles.whiteCircle,
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.name}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkmark, styles.checkmarkAvoided]}>
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            
            {/* Custom Colors - Avoided */}
            {customColors.map((color) => {
              const isSelected = avoidedColor.includes(color.hex);
              const isDisabled = preferedColor.includes(color.hex);
              return (
                <TouchableOpacity
                  key={`avoided-custom-${color.hex}`}
                  style={[
                    styles.colorCard,
                    isSelected && styles.colorCardSelectedAvoided,
                    isDisabled && styles.colorCardDisabled,
                  ]}
                  onPress={() => handleColorSelect("avoided", color.hex)}
                  disabled={isDisabled}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                    ]}
                  />
                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.colorNameSelected,
                      isDisabled && styles.colorNameDisabled,
                    ]}
                  >
                    {color.display}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkmark, styles.checkmarkAvoided]}>
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            
            {/* Add Custom Color Button - Avoided */}
            <TouchableOpacity
              style={styles.addColorButton}
              onPress={() => handleOpenColorPicker("avoided")}
            >
              <Ionicons name="add-circle" size={32} color="#EF4444" />
              <Text style={styles.addColorText}>Custom</Text>
            </TouchableOpacity>
          </View>
          </Animated.View>

          {/* Color Picker Modal */}
          <Modal
            visible={showColorPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowColorPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Pick Custom {colorPickerType === "preferred" ? "Preferred" : "Avoided"} Color
                </Text>
                <Text style={styles.modalSubtitle}>
                  Select your color from the palette
                </Text>
                
                <ColorPicker
                  value={selectedColor}
                  onComplete={onSelectColor}
                  style={styles.colorPicker}
                >
                  <Panel1 style={styles.panel} />
                  <HueSlider style={styles.slider} />
                </ColorPicker>
                
                <View style={styles.colorPreview}>
                  <View style={[
                    styles.previewCircle,
                    { backgroundColor: selectedColor }
                  ]} />
                  <Text style={styles.previewText}>{selectedColor.toUpperCase()}</Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowColorPicker(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.addButton]}
                    onPress={handleAddCustomColor}
                  >
                    <Text style={styles.addButtonText}>Add Color</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Buttons */}
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
            style={[
              styles.continueButton,
              (preferedColor.length === 0 || avoidedColor.length === 0) && styles.disabledButton,
            ]}
              onPress={handleContinue}
              disabled={preferedColor.length === 0 || avoidedColor.length === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={preferedColor.length > 0 && avoidedColor.length > 0 ? ["#2563eb", "#1e40af"] : ["#1e3a5f", "#152238"]}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  Continue {preferedColor.length > 0 && avoidedColor.length > 0 ? `(${preferedColor.length + avoidedColor.length} selected)` : ""}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCard: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "rgba(11, 27, 51, 0.8)",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1e3a5f",
    position: "relative",
  },
  colorCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  colorCardSelectedAvoided: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  colorCardDisabled: {
    opacity: 0.3,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  whiteCircle: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  colorName: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  colorNameSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  colorNameDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  checkmark: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkAvoided: {
    backgroundColor: "#EF4444",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  addColorButton: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "rgba(11, 27, 51, 0.8)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1e3a5f",
    borderStyle: "dashed",
  },
  addColorText: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#0b1b33",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: "#1e3a5f",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  colorPicker: {
    width: "100%",
    marginBottom: 16,
  },
  panel: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    marginBottom: 12,
  },
  colorPreview: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  previewCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  previewText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  cancelButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderWidth: 2,
    borderColor: "#1e40af",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
