import { StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { Transaction } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';
import { TransactionRow } from './TransactionRow';

interface SwipeableTransactionRowProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

function DeleteAction({ drag }: { drag: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(drag.value, [-120, -40, 0], [1, 0.8, 0.6], 'clamp');
    return { transform: [{ scale }] };
  });
  return (
    <View style={styles.deleteAction}>
      <Animated.View style={[styles.deleteBadge, animatedStyle]}>
        <Trash2 color={colors.textPrimary} size={18} strokeWidth={1.8} />
        <Text style={styles.deleteLabel}>Supprimer</Text>
      </Animated.View>
    </View>
  );
}

/**
 * Transaction row with swipe-left-to-delete action.
 */
export function SwipeableTransactionRow({
  transaction,
  onDelete,
}: SwipeableTransactionRowProps) {
  return (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={80}
      renderRightActions={(_progress, drag) => <DeleteAction drag={drag} />}
      onSwipeableOpen={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
          () => {}
        );
        onDelete(transaction.id);
      }}
    >
      <View style={styles.rowWrap}>
        <TransactionRow transaction={transaction} showDate={false} />
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  rowWrap: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  deleteAction: {
    width: 120,
    backgroundColor: colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBadge: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  deleteLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
});
