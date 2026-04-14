import { StyleSheet, Text, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { CategoryBreakdown } from '../../types';
import { colors, fonts, spacing, typography } from '../../constants/theme';
import {
  formatCurrency,
  formatPercentage,
  getCategoryColor,
  getCategoryLabel,
} from '../../utils/formatters';

interface CategoryDonutProps {
  data: CategoryBreakdown[];
  totalAmount: number;
  size?: number;
}

export function CategoryDonut({ data, totalAmount, size = 220 }: CategoryDonutProps) {
  const chartData = data.map((d) => ({
    label: getCategoryLabel(d.category),
    value: d.total,
    color: getCategoryColor(d.category),
  }));

  if (chartData.length === 0) {
    return (
      <View style={[styles.empty, { width: size, height: size }]}>
        <Text style={styles.emptyText}>Aucune dépense</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <PolarChart
          data={chartData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="70%">
            {({ slice }) => (
              <Pie.Slice>
                <Pie.SliceAngularInset
                  angularInset={{ angularStrokeWidth: 2, angularStrokeColor: colors.background }}
                />
              </Pie.Slice>
            )}
          </Pie.Chart>
        </PolarChart>

        <View style={[styles.center, { width: size, height: size }]} pointerEvents="none">
          <Text style={styles.centerLabel}>Total</Text>
          <Text style={styles.centerAmount}>
            {formatCurrency(totalAmount, 'EUR', true)}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {data.slice(0, 5).map((d) => (
          <View key={d.category} style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: getCategoryColor(d.category) }]}
            />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {getCategoryLabel(d.category)}
            </Text>
            <Text style={styles.legendPct}>{formatPercentage(d.percentage)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  centerAmount: {
    fontFamily: fonts.serifMedium,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  legend: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  legendPct: {
    ...typography.numericSmall,
    color: colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.elevated,
    borderRadius: 999,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
