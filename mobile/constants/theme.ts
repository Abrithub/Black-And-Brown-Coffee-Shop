import { Platform } from 'react-native';

export const COLORS = {
  primary: '#C19976',
  primaryDark: '#b38966',
  bg: '#1a0f0a',
  surface: '#2A1A10',
  surfaceLight: '#3b2315',
  border: '#5D4030',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
};

// Keep existing Colors export for compatibility
export const Colors = {
  light: { text: '#11181C', background: '#fff', tint: COLORS.primary, icon: '#687076', tabIconDefault: '#687076', tabIconSelected: COLORS.primary },
  dark: { text: '#ECEDEE', background: COLORS.bg, tint: COLORS.primary, icon: '#9BA1A6', tabIconDefault: '#9BA1A6', tabIconSelected: COLORS.primary },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: "system-ui, -apple-system, sans-serif", serif: "Georgia, serif", rounded: 'normal', mono: 'monospace' },
});
