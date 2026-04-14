/**
 * Premium dark design system — private banking digital aesthetic.
 * Sober, elegant, satisfying to use.
 */

export const colors = {
  // Surfaces
  background: '#0A0A0F',
  card: '#12121A',
  elevated: '#1A1A26',
  border: '#2A2A3E',

  // Accents
  accentGold: '#C9A84C',
  accentGreen: '#4ECCA3',
  accentRed: '#FF6B6B',

  // Text
  textPrimary: '#F0EDE8',
  textSecondary: '#8A8A9A',
  textTertiary: '#4A4A5E',

  // Semantic aliases
  positive: '#4ECCA3',
  negative: '#FF6B6B',
  neutral: '#8A8A9A',

  // Utility
  transparent: 'transparent',
  overlay: 'rgba(10, 10, 15, 0.85)',
} as const;

export const fonts = {
  serif: 'Fraunces',
  serifItalic: 'Fraunces-Italic',
  sans: 'Inter',
  sansMedium: 'Inter-Medium',
  sansSemiBold: 'Inter-SemiBold',
  sansBold: 'Inter-Bold',
  mono: 'JetBrainsMono',
  monoMedium: 'JetBrainsMono-Medium',
} as const;

export const fontSizes = {
  // Serif — for amounts (Fraunces)
  serifXl: 48,
  serifLg: 36,
  serifMd: 28,

  // Sans — UI (Inter)
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,

  // Mono — numeric / tabular (JetBrains Mono)
  monoSm: 12,
  monoMd: 14,
} as const;

export const typography = {
  // Display amounts
  amountXl: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.serifXl,
    letterSpacing: -1,
  },
  amountLg: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.serifLg,
    letterSpacing: -0.5,
  },
  amountMd: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.serifMd,
    letterSpacing: -0.25,
  },

  // Titles
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSizes.xxl,
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSizes.xl,
    letterSpacing: -0.2,
  },
  subheading: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSizes.lg,
  },

  // Body
  body: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
  },
  bodySmall: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
  },

  // Meta
  caption: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },

  // Numeric
  numeric: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.monoMd,
  },
  numericSmall: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.monoSm,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const timing = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const theme = {
  colors,
  fonts,
  fontSizes,
  typography,
  spacing,
  radii,
  shadows,
  timing,
} as const;

export type Theme = typeof theme;
export default theme;
