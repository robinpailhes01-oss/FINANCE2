import { StyleSheet, Text, View } from 'react-native';
import { Banknote, Coins, Landmark, LineChart, Wallet } from 'lucide-react-native';
import { Account, AccountType } from '../../types';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

const TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CHECKING]: 'Courant',
  [AccountType.SAVINGS]: 'Épargne',
  [AccountType.INVESTMENT]: 'Investissement',
  [AccountType.CASH]: 'Espèces',
  [AccountType.CRYPTO]: 'Crypto',
};

const TYPE_ICONS = {
  [AccountType.CHECKING]: Landmark,
  [AccountType.SAVINGS]: Banknote,
  [AccountType.INVESTMENT]: LineChart,
  [AccountType.CASH]: Wallet,
  [AccountType.CRYPTO]: Coins,
} as const;

interface AccountCardProps {
  account: Account;
  width?: number;
}

export function AccountCard({ account, width = 200 }: AccountCardProps) {
  const Icon = TYPE_ICONS[account.type];

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { backgroundColor: `${account.color}22`, borderColor: `${account.color}44` },
          ]}
        >
          <Icon color={account.color} size={14} strokeWidth={1.8} />
        </View>
        <Text style={styles.type}>{TYPE_LABELS[account.type]}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {account.name}
      </Text>
      <Text style={styles.balance}>
        {formatCurrency(account.balance, account.currency, true)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  type: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  balance: {
    ...typography.amountMd,
    color: colors.textPrimary,
  },
});
