import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { useFinanceStore, getFinancialSummary } from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/formatters';

export default function OverviewScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const accounts = useFinanceStore((s) => s.accounts);
  const period = useFinanceStore((s) => s.selectedPeriod);

  const summary = getFinancialSummary(transactions, accounts, period);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Patrimoine · {summary.periodLabel}</Text>
        <Text style={styles.amount}>{formatCurrency(summary.totalBalance)}</Text>
        <Text style={styles.placeholder}>
          Les composants UI (graphique, carte comptes, liste transactions) arrivent à
          l'étape suivante.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.amountXl,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  placeholder: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
