import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padded?: boolean;
}

/**
 * Base container with dark-theme surface styling.
 */
export function Card({
  style,
  elevated = false,
  padded = true,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        padded && styles.padded,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.elevated,
  },
  padded: {
    padding: spacing.md,
  },
});
