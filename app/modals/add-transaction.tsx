import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Delete, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  colors,
  fonts,
  fontSizes,
  radii,
  spacing,
  typography,
} from '../../constants/theme';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TransactionCategory,
} from '../../types';
import { useFinanceStore } from '../../store/useFinanceStore';
import { getCategoryLabel } from '../../utils/formatters';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { PressableScale } from '../../components/ui/PressableScale';

type TxType = 'expense' | 'income';

export default function AddTransactionModal() {
  const [type, setType] = useState<TxType>('expense');
  const [rawAmount, setRawAmount] = useState('0');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const accounts = useFinanceStore((s) => s.accounts);
  const addTransaction = useFinanceStore((s) => s.addTransaction);

  // Default the account selection to the first one once loaded.
  if (!accountId && accounts[0]) {
    setAccountId(accounts[0].id);
  }

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const amountValue = parseFloat(rawAmount.replace(',', '.')) || 0;
  const canSubmit = amountValue > 0 && !!category && !!accountId;

  const displayAmount = useMemo(() => {
    // Format with French separators while keeping user-entered decimals.
    const [intPart, decPart] = rawAmount.replace('.', ',').split(',');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    return decPart !== undefined ? `${grouped},${decPart}` : grouped;
  }, [rawAmount]);

  const pressKey = (key: string) => {
    Haptics.selectionAsync().catch(() => {});
    setRawAmount((prev) => {
      if (key === '⌫') {
        const next = prev.slice(0, -1);
        return next === '' ? '0' : next;
      }
      if (key === ',') {
        if (prev.includes(',')) return prev;
        return prev + ',';
      }
      // digit
      if (prev === '0') return key;
      // Prevent more than 2 decimals
      if (prev.includes(',')) {
        const [, dec = ''] = prev.split(',');
        if (dec.length >= 2) return prev;
      }
      // Cap integer length
      if (!prev.includes(',') && prev.length >= 9) return prev;
      return prev + key;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit || !category || !accountId) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const signedAmount = type === 'expense' ? -amountValue : amountValue;
    addTransaction({
      amount: signedAmount,
      label: label.trim() || getCategoryLabel(category),
      category,
      date: new Date().toISOString(),
      account: accountId,
    });
    router.back();
  };

  return (
    <View style={styles.backdrop}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.springify().damping(18).mass(0.6)}
        style={styles.sheet}
      >
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
                <X color={colors.textSecondary} size={18} strokeWidth={1.8} />
              </Pressable>
              <Text style={styles.title}>Nouvelle opération</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Amount */}
              <View style={styles.amountRow}>
                <Text
                  style={[
                    styles.amountSign,
                    { color: type === 'income' ? colors.accentGreen : colors.accentRed },
                  ]}
                >
                  {type === 'income' ? '+' : '−'}
                </Text>
                <Text style={styles.amount}>{displayAmount}</Text>
                <Text style={styles.amountCurrency}>€</Text>
              </View>

              {/* Type toggle */}
              <View style={styles.toggleRow}>
                <SegmentButton
                  label="Dépense"
                  active={type === 'expense'}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setType('expense');
                    setCategory(null);
                  }}
                />
                <SegmentButton
                  label="Revenu"
                  active={type === 'income'}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setType('income');
                    setCategory(null);
                  }}
                />
              </View>

              {/* Label */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Libellé</Text>
                <TextInput
                  value={label}
                  onChangeText={setLabel}
                  placeholder="Ex. Courses, Netflix…"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                />
              </View>

              {/* Account */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Compte</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                >
                  {accounts.map((acc) => {
                    const active = acc.id === accountId;
                    return (
                      <PressableScale
                        key={acc.id}
                        onPress={() => setAccountId(acc.id)}
                        haptic="selection"
                        scaleTo={0.95}
                        style={[
                          styles.chip,
                          active && {
                            borderColor: acc.color,
                            backgroundColor: `${acc.color}1F`,
                          },
                        ]}
                      >
                        <View
                          style={[styles.chipDot, { backgroundColor: acc.color }]}
                        />
                        <Text
                          style={[
                            styles.chipLabel,
                            active && { color: colors.textPrimary },
                          ]}
                        >
                          {acc.name}
                        </Text>
                      </PressableScale>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Categories */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Catégorie</Text>
                <View style={styles.catGrid}>
                  {categories.map((cat) => {
                    const active = cat === category;
                    return (
                      <PressableScale
                        key={cat}
                        onPress={() => setCategory(cat)}
                        haptic="selection"
                        scaleTo={0.93}
                        style={[styles.catCell, active && styles.catCellActive]}
                      >
                        <CategoryIcon category={cat} size={44} />
                        <Text
                          style={[styles.catLabel, active && styles.catLabelActive]}
                          numberOfLines={1}
                        >
                          {getCategoryLabel(cat)}
                        </Text>
                      </PressableScale>
                    );
                  })}
                </View>
              </View>

              {/* Date (read-only) */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Date</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>
                    {new Intl.DateTimeFormat('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date())}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Keypad */}
            <View style={styles.keypad}>
              {[
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                [',', '0', '⌫'],
              ].map((row, i) => (
                <View key={i} style={styles.keypadRow}>
                  {row.map((key) => (
                    <PressableScale
                      key={key}
                      haptic="selection"
                      scaleTo={0.9}
                      onPress={() => pressKey(key)}
                      style={styles.key}
                    >
                      {key === '⌫' ? (
                        <Delete color={colors.textPrimary} size={20} strokeWidth={1.6} />
                      ) : (
                        <Text style={styles.keyText}>{key}</Text>
                      )}
                    </PressableScale>
                  ))}
                </View>
              ))}
            </View>

            {/* Submit */}
            <View style={styles.submitWrap}>
              <PressableScale
                haptic="medium"
                scaleTo={0.97}
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={[styles.submit, !canSubmit && styles.submitDisabled]}
              >
                <Text
                  style={[
                    styles.submitText,
                    !canSubmit && { color: colors.textTertiary },
                  ]}
                >
                  Ajouter
                </Text>
              </PressableScale>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '94%',
    minHeight: '82%',
    borderTopWidth: 0.5,
    borderColor: colors.border,
  },

  handleWrap: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: { ...typography.subheading, color: colors.textPrimary },
  close: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  amountSign: {
    fontFamily: fonts.serifMedium,
    fontSize: 34,
    marginBottom: 8,
  },
  amount: {
    fontFamily: fonts.serifMedium,
    fontSize: 48,
    color: colors.textPrimary,
    letterSpacing: -1.5,
  },
  amountCurrency: {
    fontFamily: fonts.serifMedium,
    fontSize: 28,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.elevated,
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
  },
  segment: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  segmentActive: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  segmentText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textPrimary,
    fontFamily: fonts.sansSemiBold,
  },

  field: { gap: spacing.sm },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.elevated,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  chipsRow: { gap: spacing.sm, paddingRight: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.elevated,
    borderRadius: radii.full,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipLabel: { ...typography.bodySmall, color: colors.textSecondary },

  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  catCell: {
    width: '23.3%', // ~4 per row with gaps
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    gap: 6,
    borderRadius: radii.md,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  catCellActive: {
    backgroundColor: colors.elevated,
    borderColor: colors.border,
  },
  catLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  catLabelActive: {
    color: colors.textPrimary,
  },

  dateBox: {
    backgroundColor: colors.elevated,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  dateText: { ...typography.body, color: colors.textPrimary },

  keypad: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    aspectRatio: 1.9,
    backgroundColor: colors.elevated,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  keyText: {
    fontFamily: fonts.serifMedium,
    fontSize: 22,
    color: colors.textPrimary,
  },

  submitWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  submit: {
    backgroundColor: colors.accentGold,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: colors.elevated,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  submitText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSizes.md,
    color: colors.background,
    letterSpacing: 0.3,
  },
});
