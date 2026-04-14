import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography } from '../../constants/theme';
import {
  getBalanceHistory,
  getCategoryBreakdown,
  getFinancialSummary,
  useFinanceStore,
} from '../../store/useFinanceStore';
import { Period } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Card } from '../../components/ui/Card';
import { BalanceChart } from '../../components/charts/BalanceChart';
import { CategoryDonut } from '../../components/charts/CategoryDonut';
import { TopExpensesBars } from '../../components/charts/TopExpensesBars';
import { SectionHeader } from '../../components/ui/SectionHeader';

export default function AnalyticsScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const accounts = useFinanceStore((s) => s.accounts);
  const period = useFinanceStore((s) => s.selectedPeriod);
  const setPeriod = useFinanceStore((s) => s.setPeriod);

  const summary = useMemo(
    () => getFinancialSummary(transactions, accounts, period),
    [transactions, accounts, period]
  );
  const history = useMemo(
    () => getBalanceHistory(transactions, accounts, period),
    [transactions, accounts, period]
  );
  const breakdown = useMemo(
    () => getCategoryBreakdown(transactions, period),
    [transactions, period]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.label}>Analyse</Text>
          <Text style={styles.title}>Répartition & tendances</Text>
        </View>

        <SegmentedControl<Period>
          segments={[
            { value: 'week', label: 'Semaine' },
            { value: 'month', label: 'Mois' },
            { value: 'quarter', label: 'Trimestre' },
            { value: 'year', label: 'Année' },
          ]}
          value={period}
          onChange={setPeriod}
        />

        {/* Balance evolution */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <SectionHeader title="Évolution du patrimoine" />
          <Card padded>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartLabel}>Solde actuel</Text>
                <Text style={styles.chartAmount}>
                  {formatCurrency(summary.totalBalance)}
                </Text>
              </View>
            </View>
            <BalanceChart data={history} height={200} />
          </Card>
        </Animated.View>

        {/* Category breakdown */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <SectionHeader title="Répartition des dépenses" />
          <Card padded>
            <CategoryDonut data={breakdown} totalAmount={summary.totalExpenses} />
          </Card>
        </Animated.View>

        {/* Top expenses */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <SectionHeader title="Top dépenses" />
          <Card padded>
            <TopExpensesBars data={breakdown} limit={5} />
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  label: { ...typography.label, color: colors.textSecondary },
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.xs },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  chartLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  chartAmount: {
    ...typography.amountMd,
    color: colors.textPrimary,
  },
});
