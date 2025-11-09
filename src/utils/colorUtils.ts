import { ColorItem } from '../types/item';

/**
 * Parse color JSON string to ColorItem array
 * @param colorString - JSON string like "[{\"name\":\"Black\",\"hex\":\"#000000\"}]"
 * @returns Array of ColorItem or empty array if parsing fails
 */
export const parseColors = (colorString?: string): ColorItem[] => {
  if (!colorString || colorString.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(colorString);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is ColorItem => 
          typeof item === 'object' && 
          item !== null && 
          'name' in item && 
          'hex' in item
      );
    }
    return [];
  } catch (error) {
    console.warn('Failed to parse color string:', colorString, error);
    return [];
  }
};

/**
 * Convert ColorItem array to JSON string
 * @param colors - Array of ColorItem
 * @returns JSON string (empty array "[]" if no colors)
 */
export const stringifyColors = (colors: ColorItem[]): string => {
  if (!colors || colors.length === 0) {
    return '[]'; // Return empty JSON array instead of empty string
  }
  return JSON.stringify(colors);
};

/**
 * Get display text for colors
 * @param colorString - JSON string or ColorItem array
 * @returns Formatted string like "Black, Cream" or "2 colors"
 */
export const getColorDisplayText = (colorString?: string | ColorItem[]): string => {
  const colors = typeof colorString === 'string' 
    ? parseColors(colorString) 
    : colorString || [];
  
  if (colors.length === 0) {
    return 'No color';
  }
  
  if (colors.length <= 3) {
    return colors.map(c => c.name).join(', ');
  }
  
  return `${colors.length} colors`;
};

/**
 * Get first color hex for preview
 * @param colorString - JSON string
 * @returns Hex color code or default gray
 */
export const getFirstColorHex = (colorString?: string): string => {
  const colors = parseColors(colorString);
  return colors.length > 0 ? colors[0].hex : '#d1d5db';
};

/**
 * Check if a color is already selected
 * @param colors - Current selected colors
 * @param colorToCheck - Color to check
 * @returns true if color is already selected
 */
export const isColorSelected = (colors: ColorItem[], colorToCheck: ColorItem): boolean => {
  return colors.some(c => c.hex === colorToCheck.hex);
};

/**
 * Toggle color selection
 * @param colors - Current selected colors
 * @param color - Color to toggle
 * @returns Updated colors array
 */
export const toggleColor = (colors: ColorItem[], color: ColorItem): ColorItem[] => {
  const isSelected = isColorSelected(colors, color);
  
  if (isSelected) {
    return colors.filter(c => c.hex !== color.hex);
  } else {
    return [...colors, color];
  }
};

/**
 * Predefined color palette
 */
export const COLOR_PALETTE: ColorItem[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Cream', hex: '#F0E6D2' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Maroon', hex: '#800000' },
];
