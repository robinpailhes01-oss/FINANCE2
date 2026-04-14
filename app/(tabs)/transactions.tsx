import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search } from 'lucide-react-native';
import { colors, fonts, fontSizes, radii, spacing, typography } from '../../constants/theme';
import {
  getTransactionsByPeriod,
  useFinanceStore,
} from '../../store/useFinanceStore';
import { Period, Transaction } from '../../types';
import { formatDate, isIncomeCategory } from '../../utils/formatters';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { SwipeableTransactionRow } from '../../components/transactions/SwipeableTransactionRow';

type Filter = 'all' | 'income' | 'expense';

type ListItem =
  | { type: 'header'; key: string; label: string }
  | { type: 'row'; key: string; transaction: Transaction };

export default function TransactionsScreen() {
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const period = useFinanceStore((s) => s.selectedPeriod);
  const setPeriod = useFinanceStore((s) => s.setPeriod);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const listData = useMemo<ListItem[]>(() => {
    const scoped = getTransactionsByPeriod(transactions, period);
    const lowerQuery = query.trim().toLowerCase();

    const filtered = scoped.filter((t) => {
      if (filter === 'income' && !isIncomeCategory(t.category)) return false;
      if (filter === 'expense' && isIncomeCategory(t.category)) return false;
      if (lowerQuery && !t.label.toLowerCase().includes(lowerQuery)) return false;
      return true;
    });

    // Group by day (YYYY-MM-DD)
    const groups = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const key = t.date.slice(0, 10);
      const arr = groups.get(key) ?? [];
      arr.push(t);
      groups.set(key, arr);
    }

    const items: ListItem[] = [];
    for (const [day, txs] of groups) {
      items.push({
        type: 'header',
        key: `h-${day}`,
        label: formatDate(day, 'relative'),
      });
      for (const t of txs) {
        items.push({ type: 'row', key: t.id, transaction: t });
      }
    }
    return items;
  }, [transactions, period, query, filter]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBlock}>
        <Text style={styles.label}>Opérations</Text>
        <Text style={styles.title}>Historique</Text>

        <View style={styles.searchBox}>
          <Search color={colors.textTertiary} size={16} strokeWidth={1.8} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une opération"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <SegmentedControl<Filter>
            segments={[
              { value: 'all', label: 'Tout' },
              { value: 'income', label: 'Revenus' },
              { value: 'expense', label: 'Dépenses' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </View>

        <View style={{ marginTop: spacing.sm }}>
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
        </View>
      </View>

      <FlashList
        data={listData}
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{item.label}</Text>
            </View>
          ) : (
            <SwipeableTransactionRow
              transaction={item.transaction}
              onDelete={handleDelete}
            />
          )
        }
        keyExtractor={(item) => item.key}
        getItemType={(item) => item.type}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      />
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Aucune opération</Text>
      <Text style={styles.emptyHint}>
        Ajustez vos filtres ou ajoutez une nouvelle opération.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  label: { ...typography.label, color: colors.textSecondary },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.md },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.elevated,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    padding: 0,
  },

  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  sectionHeaderText: {
    ...typography.label,
    color: colors.textSecondary,
  },

  separator: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 42 + spacing.md,
  },

  empty: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  emptyHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
