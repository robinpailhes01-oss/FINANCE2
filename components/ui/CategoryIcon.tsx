import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  Briefcase,
  Car,
  Clapperboard,
  HeartPulse,
  Home,
  Laptop,
  LucideIcon,
  Plane,
  Repeat,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react-native';
import { TransactionCategory } from '../../types';
import { radii } from '../../constants/theme';
import { getCategoryColor } from '../../utils/formatters';

const ICONS: Record<TransactionCategory, LucideIcon> = {
  [TransactionCategory.SALARY]: Briefcase,
  [TransactionCategory.FREELANCE]: Laptop,
  [TransactionCategory.OTHER_INCOME]: TrendingUp,
  [TransactionCategory.HOUSING]: Home,
  [TransactionCategory.FOOD]: UtensilsCrossed,
  [TransactionCategory.TRANSPORT]: Car,
  [TransactionCategory.HEALTH]: HeartPulse,
  [TransactionCategory.ENTERTAINMENT]: Clapperboard,
  [TransactionCategory.SHOPPING]: ShoppingBag,
  [TransactionCategory.SUBSCRIPTIONS]: Repeat,
  [TransactionCategory.TRAVEL]: Plane,
  [TransactionCategory.OTHER_EXPENSE]: Wallet,
};

interface CategoryIconProps {
  category: TransactionCategory;
  size?: number;
  style?: ViewStyle;
}

/**
 * Circular icon badge tinted by category color.
 */
export function CategoryIcon({ category, size = 40, style }: CategoryIconProps) {
  const color = getCategoryColor(category);
  const Icon = ICONS[category];
  const iconSize = Math.round(size * 0.48);

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: `${color}1F`, // ~12% alpha
          borderColor: `${color}33`, // ~20% alpha
        },
        style,
      ]}
    >
      <Icon color={color} size={iconSize} strokeWidth={1.6} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
});
