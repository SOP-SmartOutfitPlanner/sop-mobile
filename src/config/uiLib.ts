import { Colors, Typography, Spacings, BorderRadiuses } from 'react-native-ui-lib';

// Cấu hình màu sắc cho ứng dụng
Colors.loadColors({
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Shadow colors
  shadow: '#000000',
  
  // Transparent
  transparent: 'transparent',
});

// Cấu hình typography
Typography.loadTypographies({
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  h6: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  
  subtitle1: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  subtitle2: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  overline: { fontSize: 10, fontWeight: '600', lineHeight: 14, letterSpacing: 1.5 },
  
  button: { fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.5 },
});

// Cấu hình spacing
Spacings.loadSpacings({
  's1': 4,
  's2': 8,
  's3': 12,
  's4': 16,
  's5': 20,
  's6': 24,
  's7': 28,
  's8': 32,
  's9': 36,
  's10': 40,
});

// Cấu hình border radius
BorderRadiuses.loadBorders({
  br0: 0,
  br10: 4,
  br20: 8,
  br30: 12,
  br40: 16,
  br50: 20,
  br60: 24,
  br100: 9999, // Fully rounded
});

export { Colors, Typography, Spacings, BorderRadiuses };
