import { TransactionCategory, INCOME_CATEGORIES } from '../types';
import { colors } from '../constants/theme';

/**
 * Formats a numeric amount as currency.
 *
 * @param amount — amount in major units (e.g. euros, not cents).
 * @param currency — ISO 4217 currency code (default 'EUR').
 * @param compact — if true, uses compact notation (e.g. 1.2K, 3.4M).
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  compact: boolean = false
): string {
  const absolute = Math.abs(amount);

  if (compact && absolute >= 1000) {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Formats a signed amount with explicit + / − sign prefix.
 */
export function formatSignedCurrency(
  amount: number,
  currency: string = 'EUR',
  compact: boolean = false
): string {
  const formatted = formatCurrency(Math.abs(amount), currency, compact);
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `−${formatted}`;
  return formatted;
}

type DateFormat = 'short' | 'medium' | 'long' | 'relative';

/**
 * Formats a date string or Date.
 *
 * - short:    14/04
 * - medium:   14 avr.
 * - long:     14 avril 2026
 * - relative: Aujourd'hui / Hier / il y a 3 jours / 14 avr.
 */
export function formatDate(
  date: string | Date,
  format: DateFormat = 'medium'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeDate(d);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { day: '2-digit', month: '2-digit' }
      : format === 'long'
        ? { day: 'numeric', month: 'long', year: 'numeric' }
        : { day: 'numeric', month: 'short' };

  return new Intl.DateTimeFormat('fr-FR', options).format(d);
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays > 1 && diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays === -1) return 'Demain';
  if (diffDays < -1 && diffDays > -7) return `dans ${Math.abs(diffDays)} jours`;

  return formatDate(date, 'medium');
}

/**
 * Formats a ratio (0..1) as a percentage string.
 */
export function formatPercentage(value: number, showSign: boolean = false): string {
  const pct = value * 100;
  const rounded = Math.abs(pct) >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10;
  const sign = showSign && pct > 0 ? '+' : pct < 0 ? '−' : '';
  return `${sign}${Math.abs(rounded)}%`;
}

// ─── Category metadata ───────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  [TransactionCategory.SALARY]: 'Salaire',
  [TransactionCategory.FREELANCE]: 'Freelance',
  [TransactionCategory.OTHER_INCOME]: 'Autre revenu',
  [TransactionCategory.HOUSING]: 'Logement',
  [TransactionCategory.FOOD]: 'Alimentation',
  [TransactionCategory.TRANSPORT]: 'Transport',
  [TransactionCategory.HEALTH]: 'Santé',
  [TransactionCategory.ENTERTAINMENT]: 'Loisirs',
  [TransactionCategory.SHOPPING]: 'Shopping',
  [TransactionCategory.SUBSCRIPTIONS]: 'Abonnements',
  [TransactionCategory.TRAVEL]: 'Voyages',
  [TransactionCategory.OTHER_EXPENSE]: 'Autre dépense',
};

/**
 * Lucide icon name (string) for a given category.
 * Consumers should import the matching component from `lucide-react-native`.
 */
const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  [TransactionCategory.SALARY]: 'Briefcase',
  [TransactionCategory.FREELANCE]: 'Laptop',
  [TransactionCategory.OTHER_INCOME]: 'TrendingUp',
  [TransactionCategory.HOUSING]: 'Home',
  [TransactionCategory.FOOD]: 'UtensilsCrossed',
  [TransactionCategory.TRANSPORT]: 'Car',
  [TransactionCategory.HEALTH]: 'HeartPulse',
  [TransactionCategory.ENTERTAINMENT]: 'Clapperboard',
  [TransactionCategory.SHOPPING]: 'ShoppingBag',
  [TransactionCategory.SUBSCRIPTIONS]: 'Repeat',
  [TransactionCategory.TRAVEL]: 'Plane',
  [TransactionCategory.OTHER_EXPENSE]: 'Wallet',
};

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  [TransactionCategory.SALARY]: colors.accentGreen,
  [TransactionCategory.FREELANCE]: colors.accentGreen,
  [TransactionCategory.OTHER_INCOME]: colors.accentGreen,
  [TransactionCategory.HOUSING]: '#8B7FE8',
  [TransactionCategory.FOOD]: '#E8A87C',
  [TransactionCategory.TRANSPORT]: '#6BC5E8',
  [TransactionCategory.HEALTH]: '#FF8FA3',
  [TransactionCategory.ENTERTAINMENT]: '#C78FE8',
  [TransactionCategory.SHOPPING]: '#E8C46B',
  [TransactionCategory.SUBSCRIPTIONS]: '#8A8A9A',
  [TransactionCategory.TRAVEL]: '#4ECCCB',
  [TransactionCategory.OTHER_EXPENSE]: '#8A8A9A',
};

export function getCategoryLabel(category: TransactionCategory): string {
  return CATEGORY_LABELS[category];
}

export function getCategoryIcon(category: TransactionCategory): string {
  return CATEGORY_ICONS[category];
}

export function getCategoryColor(category: TransactionCategory): string {
  return CATEGORY_COLORS[category];
}

export function isIncomeCategory(category: TransactionCategory): boolean {
  return INCOME_CATEGORIES.includes(category);
}
