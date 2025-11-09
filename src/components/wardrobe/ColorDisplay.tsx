import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColorItem } from '../../types/item';
import { parseColors, getColorDisplayText } from '../../utils/colorUtils';

interface ColorDisplayProps {
  colorString?: string;
  maxDisplay?: number;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  colorString,
  maxDisplay = 3,
  showText = true,
  size = 'medium',
}) => {
  const colors = parseColors(colorString);

  if (colors.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.emptyDot, sizeStyles[size]]} />
        {showText && <Text style={styles.emptyText}>No color</Text>}
      </View>
    );
  }

  const displayColors = colors.slice(0, maxDisplay);
  const remainingCount = Math.max(0, colors.length - maxDisplay);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {displayColors.map((color, index) => (
          <View
            key={`${color.hex}-${index}`}
            style={[
              styles.colorDot,
              sizeStyles[size],
              { backgroundColor: color.hex },
              color.hex === '#FFFFFF' && styles.whiteBorder,
            ]}
          />
        ))}
        {remainingCount > 0 && (
          <View style={[styles.remainingDot, sizeStyles[size]]}>
            <Text style={[styles.remainingText, remainingTextSizes[size]]}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
      {showText && (
        <Text style={styles.colorText} numberOfLines={1}>
          {getColorDisplayText(colors)}
        </Text>
      )}
    </View>
  );
};

const sizeStyles = StyleSheet.create({
  small: {
    width: 16,
    height: 16,
  },
  medium: {
    width: 24,
    height: 24,
  },
  large: {
    width: 32,
    height: 32,
  },
});

const remainingTextSizes = StyleSheet.create({
  small: {
    fontSize: 8,
  },
  medium: {
    fontSize: 10,
  },
  large: {
    fontSize: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  whiteBorder: {
    borderColor: '#d1d5db',
    borderWidth: 1.5,
  },
  emptyDot: {
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  remainingDot: {
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  colorText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
