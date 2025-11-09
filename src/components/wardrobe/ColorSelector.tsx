import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorItem } from '../../types/item';
import { COLOR_PALETTE, isColorSelected, toggleColor } from '../../utils/colorUtils';

interface ColorSelectorProps {
  selectedColors: ColorItem[];
  onColorToggle: (color: ColorItem) => void;
  maxColors?: number;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColors,
  onColorToggle,
  maxColors = 5,
}) => {
  const handleColorPress = (color: ColorItem) => {
    const isSelected = isColorSelected(selectedColors, color);
    
    // Check max limit
    if (!isSelected && selectedColors.length >= maxColors) {
      return; // Don't add more colors if limit reached
    }
    
    onColorToggle(color);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Colors</Text>
        {selectedColors.length > 0 && (
          <Text style={styles.count}>
            {selectedColors.length}/{maxColors} selected
          </Text>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COLOR_PALETTE.map((color) => {
          const isSelected = isColorSelected(selectedColors, color);
          const isDisabled = !isSelected && selectedColors.length >= maxColors;
          
          return (
            <TouchableOpacity
              key={color.hex}
              style={[
                styles.colorButton,
                isSelected && styles.colorButtonSelected,
                isDisabled && styles.colorButtonDisabled,
              ]}
              onPress={() => handleColorPress(color)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.hex },
                  color.hex === '#FFFFFF' && styles.whiteCircle,
                ]}
              >
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons 
                      name="checkmark" 
                      size={16} 
                      color={color.hex === '#FFFFFF' || color.hex === '#FFFF00' ? '#000' : '#fff'} 
                    />
                  </View>
                )}
              </View>
              <Text style={[styles.colorName, isDisabled && styles.colorNameDisabled]} numberOfLines={1}>
                {color.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {selectedColors.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>Selected:</Text>
          <View style={styles.selectedColors}>
            {selectedColors.map((color, index) => (
              <View key={`${color.hex}-${index}`} style={styles.selectedColorChip}>
                <View
                  style={[
                    styles.selectedColorDot,
                    { backgroundColor: color.hex },
                    color.hex === '#FFFFFF' && styles.whiteCircle,
                  ]}
                />
                <Text style={styles.selectedColorName}>{color.name}</Text>
                <TouchableOpacity
                  onPress={() => onColorToggle(color)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  count: {
    fontSize: 12,
    color: '#6b7280',
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  colorButton: {
    alignItems: 'center',
    width: 60,
    paddingVertical: 8,
  },
  colorButtonSelected: {
    // Selected state styling handled by circle
  },
  colorButtonDisabled: {
    opacity: 0.4,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle: {
    borderColor: '#d1d5db',
    borderWidth: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
  },
  colorNameDisabled: {
    color: '#9ca3af',
  },
  selectedContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  selectedColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedColorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedColorName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});
