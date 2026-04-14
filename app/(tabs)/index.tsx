import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, radii, spacing, typography } from '../../constants/theme';
import {
  getBalanceHistory,
  getFinancialSummary,
  useFinanceStore,
} from '../../store/useFinanceStore';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatSignedCurrency,
} from '../../utils/formatters';
import { AccountCard } from '../../components/transactions/AccountCard';
import { TransactionRow } from '../../components/transactions/TransactionRow';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { FAB } from '../../components/ui/FAB';

export default function DashboardScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const accounts = useFinanceStore((s) => s.accounts);

  const summary = useMemo(
    () => getFinancialSummary(transactions, accounts, 'month'),
    [transactions, accounts]
  );

  // Monthly variation = current total − total one month ago (from history).
  const variation = useMemo(() => {
    const history = getBalanceHistory(transactions, accounts, 'month');
    if (history.length < 2) return { absolute: 0, ratio: 0 };
    const first = history[0].balance;
    const last = history[history.length - 1].balance;
    return {
      absolute: last - first,
      ratio: first !== 0 ? (last - first) / Math.abs(first) : 0,
    };
  }, [transactions, accounts]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions]
  );

  const today = formatDate(new Date(), 'long');
  const positiveVariation = variation.absolute >= 0;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={styles.hello}>Bonjour Robin</Text>
            <Text style={styles.date}>{capitalize(today)}</Text>
          </Animated.View>

          {/* Hero */}
          <Animated.View
            entering={FadeInUp.delay(80).duration(500)}
            style={styles.hero}
          >
            <Text style={styles.heroLabel}>Patrimoine total</Text>
            <Text style={styles.heroAmount}>{formatCurrency(summary.totalBalance)}</Text>
            <View style={styles.heroVariationRow}>
              <View
                style={[
                  styles.variationChip,
                  {
                    backgroundColor: positiveVariation
                      ? `${colors.accentGreen}1F`
                      : `${colors.accentRed}1F`,
                  },
                ]}
              >
                {positiveVariation ? (
                  <ArrowUpRight color={colors.accentGreen} size={14} strokeWidth={2} />
                ) : (
                  <ArrowDownRight color={colors.accentRed} size={14} strokeWidth={2} />
                )}
                <Text
                  style={[
                    styles.variationText,
                    { color: positiveVariation ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {formatSignedCurrency(variation.absolute, 'EUR', true)} ·{' '}
                  {formatPercentage(variation.ratio, true)}
                </Text>
              </View>
              <Text style={styles.variationPeriod}>sur 30 jours</Text>
            </View>
          </Animated.View>

          {/* Accounts — horizontal scroll */}
          <Animated.View
            entering={FadeInUp.delay(160).duration(500)}
            style={styles.section}
          >
            <SectionHeader title="Vos comptes" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountsRow}
            >
              {accounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} width={180} />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Monthly summary: income / expenses / savings rate */}
          <Animated.View
            entering={FadeInUp.delay(240).duration(500)}
            style={styles.section}
          >
            <SectionHeader title={summary.periodLabel} />
            <View style={styles.summaryRow}>
              <SummaryTile
                label="Revenus"
                amount={summary.totalIncome}
                color={colors.accentGreen}
              />
              <SummaryTile
                label="Dépenses"
                amount={summary.totalExpenses}
                color={colors.accentRed}
              />
            </View>
            <Card style={styles.savingsCard} padded>
              <View>
                <Text style={styles.savingsLabel}>Taux d'épargne</Text>
                <Text style={styles.savingsHint}>
                  Part des revenus mise de côté
                </Text>
              </View>
              <Text
                style={[
                  styles.savingsValue,
                  {
                    color:
                      summary.savingsRate >= 0
                        ? colors.accentGold
                        : colors.accentRed,
                  },
                ]}
              >
                {formatPercentage(Math.max(summary.savingsRate, 0))}
              </Text>
            </Card>
          </Animated.View>

          {/* Recent transactions */}
          <Animated.View
            entering={FadeInUp.delay(320).duration(500)}
            style={styles.section}
          >
            <SectionHeader
              title="Dernières opérations"
              action={{ label: 'Tout voir', onPress: () => router.push('/transactions') }}
            />
            <Card padded={false} style={styles.listCard}>
              {recentTransactions.map((tx, idx) => (
                <View key={tx.id}>
                  <View style={{ paddingHorizontal: spacing.md }}>
                    <TransactionRow transaction={tx} />
                  </View>
                  {idx < recentTransactions.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </Card>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <FAB onPress={() => router.push('/modals/add-transaction')} />
    </View>
  );
}

function SummaryTile({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: string;
}) {
  return (
    <Card style={styles.summaryTile} padded>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryAmount, { color }]}>
        {formatCurrency(amount, 'EUR', true)}
      </Text>
    </Card>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.xl,
  },

  hello: {
    ...typography.title,
    color: colors.textPrimary,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  hero: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  heroLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  heroAmount: {
    ...typography.amountXl,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroVariationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  variationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  variationText: {
    ...typography.numericSmall,
    fontSize: 13,
  },
  variationPeriod: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  section: { gap: 0 },

  accountsRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTile: {
    flex: 1,
    gap: spacing.sm,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryAmount: {
    ...typography.amountMd,
    fontSize: 24,
  },

  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingsLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  savingsHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  savingsValue: {
    ...typography.amountMd,
    fontSize: 32,
  },

  listCard: {
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 42 + spacing.md,
  },
});
