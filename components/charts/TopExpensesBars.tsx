import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { CategoryBreakdown } from '../../types';
import { colors, radii, spacing, typography } from '../../constants/theme';
import {
  formatCurrency,
  getCategoryColor,
  getCategoryLabel,
} from '../../utils/formatters';

interface TopExpensesBarsProps {
  data: CategoryBreakdown[];
  limit?: number;
}

export function TopExpensesBars({ data, limit = 5 }: TopExpensesBarsProps) {
  const top = data.slice(0, limit);
  const max = top[0]?.total ?? 1;

  if (top.length === 0) {
    return (
      <Text style={styles.empty}>
        Aucune dépense à afficher sur cette période.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {top.map((d, i) => {
        const ratio = d.total / max;
        const color = getCategoryColor(d.category);
        return (
          <View key={d.category} style={styles.row}>
            <View style={styles.topLine}>
              <Text style={styles.label}>{getCategoryLabel(d.category)}</Text>
              <Text style={styles.amount}>{formatCurrency(d.total, 'EUR', true)}</Text>
            </View>
            <View style={styles.track}>
              <Animated.View
                entering={FadeInRight.delay(i * 60).duration(450)}
                style={[
                  styles.fill,
                  { backgroundColor: color, width: `${Math.max(ratio * 100, 3)}%` },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  amount: {
    ...typography.numericSmall,
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
  },
  empty: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
