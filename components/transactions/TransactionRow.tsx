import { StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';
import {
  formatDate,
  formatSignedCurrency,
  getCategoryLabel,
  isIncomeCategory,
} from '../../utils/formatters';
import { CategoryIcon } from '../ui/CategoryIcon';
import { PressableScale } from '../ui/PressableScale';

interface TransactionRowProps {
  transaction: Transaction;
  showDate?: boolean;
  onPress?: () => void;
}

export function TransactionRow({
  transaction,
  showDate = true,
  onPress,
}: TransactionRowProps) {
  const positive = isIncomeCategory(transaction.category);
  const amountColor = positive ? colors.positive : colors.textPrimary;

  return (
    <PressableScale style={styles.row} onPress={onPress} haptic="selection" scaleTo={0.98}>
      <CategoryIcon category={transaction.category} size={42} />
      <View style={styles.middle}>
        <Text style={styles.label} numberOfLines={1}>
          {transaction.label}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {getCategoryLabel(transaction.category)}
          {showDate ? ` · ${formatDate(transaction.date, 'relative')}` : ''}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatSignedCurrency(transaction.amount)}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.numeric,
    fontSize: 15,
  },
});
