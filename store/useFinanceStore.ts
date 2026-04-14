import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import {
  Account,
  AccountType,
  BalancePoint,
  CategoryBreakdown,
  FinancialSummary,
  Period,
  Transaction,
  TransactionCategory,
  INCOME_CATEGORIES,
} from '../types';
import { colors } from '../constants/theme';

// ─── Storage (MMKV) ──────────────────────────────────────────────────────────

const storage = createMMKV({ id: 'finance-store' });

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => {
    storage.remove(name);
  },
};

// ─── Seed data ───────────────────────────────────────────────────────────────

const now = new Date();
const daysAgo = (n: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-checking',
    name: 'Compte courant',
    type: AccountType.CHECKING,
    balance: 3450,
    currency: 'EUR',
    color: colors.accentGold,
  },
  {
    id: 'acc-savings',
    name: 'Livret A',
    type: AccountType.SAVINGS,
    balance: 8200,
    currency: 'EUR',
    color: colors.accentGreen,
  },
  {
    id: 'acc-crypto',
    name: 'Crypto',
    type: AccountType.CRYPTO,
    balance: 1200,
    currency: 'EUR',
    color: '#8B7FE8',
  },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    amount: 3200,
    label: 'Salaire — Acme Inc.',
    category: TransactionCategory.SALARY,
    date: daysAgo(2),
    account: 'acc-checking',
    isRecurring: true,
  },
  {
    id: 't-2',
    amount: -1150,
    label: 'Loyer — avril',
    category: TransactionCategory.HOUSING,
    date: daysAgo(3),
    account: 'acc-checking',
    isRecurring: true,
  },
  {
    id: 't-3',
    amount: -68.4,
    label: 'Carrefour',
    category: TransactionCategory.FOOD,
    date: daysAgo(5),
    account: 'acc-checking',
  },
  {
    id: 't-4',
    amount: -14.99,
    label: 'Netflix',
    category: TransactionCategory.SUBSCRIPTIONS,
    date: daysAgo(6),
    account: 'acc-checking',
    isRecurring: true,
  },
  {
    id: 't-5',
    amount: -42,
    label: 'Uber',
    category: TransactionCategory.TRANSPORT,
    date: daysAgo(7),
    account: 'acc-checking',
  },
  {
    id: 't-6',
    amount: 850,
    label: 'Mission freelance',
    category: TransactionCategory.FREELANCE,
    date: daysAgo(9),
    account: 'acc-checking',
  },
  {
    id: 't-7',
    amount: -32.5,
    label: 'Le Grand Bistrot',
    category: TransactionCategory.FOOD,
    date: daysAgo(10),
    account: 'acc-checking',
    note: 'Dîner avec Alex',
  },
  {
    id: 't-8',
    amount: -89,
    label: 'Zara',
    category: TransactionCategory.SHOPPING,
    date: daysAgo(12),
    account: 'acc-checking',
  },
  {
    id: 't-9',
    amount: -28,
    label: 'Cinéma Pathé',
    category: TransactionCategory.ENTERTAINMENT,
    date: daysAgo(15),
    account: 'acc-checking',
  },
  {
    id: 't-10',
    amount: -9.99,
    label: 'Spotify',
    category: TransactionCategory.SUBSCRIPTIONS,
    date: daysAgo(18),
    account: 'acc-checking',
    isRecurring: true,
  },
];

// ─── Store ───────────────────────────────────────────────────────────────────

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  selectedPeriod: Period;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  setPeriod: (period: Period) => void;
  reset: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: DEFAULT_TRANSACTIONS,
      accounts: DEFAULT_ACCOUNTS,
      selectedPeriod: 'month',

      addTransaction: (tx) =>
        set((state) => {
          const newTx: Transaction = { ...tx, id: `t-${Date.now()}` };
          const accounts = state.accounts.map((a) =>
            a.id === tx.account ? { ...a, balance: a.balance + tx.amount } : a
          );
          return { transactions: [newTx, ...state.transactions], accounts };
        }),

      updateTransaction: (id, patch) =>
        set((state) => {
          const existing = state.transactions.find((t) => t.id === id);
          if (!existing) return state;
          const updated: Transaction = { ...existing, ...patch };
          const transactions = state.transactions.map((t) =>
            t.id === id ? updated : t
          );
          // Adjust account balance if amount or account changed
          let accounts = state.accounts;
          if (patch.amount !== undefined || patch.account !== undefined) {
            accounts = accounts.map((a) => {
              if (a.id === existing.account) {
                return { ...a, balance: a.balance - existing.amount };
              }
              return a;
            });
            accounts = accounts.map((a) => {
              if (a.id === updated.account) {
                return { ...a, balance: a.balance + updated.amount };
              }
              return a;
            });
          }
          return { transactions, accounts };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          const existing = state.transactions.find((t) => t.id === id);
          if (!existing) return state;
          const accounts = state.accounts.map((a) =>
            a.id === existing.account ? { ...a, balance: a.balance - existing.amount } : a
          );
          return {
            transactions: state.transactions.filter((t) => t.id !== id),
            accounts,
          };
        }),

      addAccount: (account) =>
        set((state) => ({
          accounts: [...state.accounts, { ...account, id: `acc-${Date.now()}` }],
        })),

      setPeriod: (period) => set({ selectedPeriod: period }),

      reset: () =>
        set({
          transactions: DEFAULT_TRANSACTIONS,
          accounts: DEFAULT_ACCOUNTS,
          selectedPeriod: 'month',
        }),
    }),
    {
      name: 'finance-store-v1',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// ─── Selectors ───────────────────────────────────────────────────────────────

/**
 * Returns the start date for a given period, relative to `reference`.
 * `'all'` returns the epoch.
 */
function periodStart(period: Period, reference: Date = new Date()): Date {
  const d = new Date(reference);
  switch (period) {
    case 'week': {
      d.setDate(d.getDate() - 7);
      return d;
    }
    case 'month': {
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    case 'quarter': {
      d.setMonth(d.getMonth() - 3);
      return d;
    }
    case 'year': {
      d.setFullYear(d.getFullYear() - 1);
      return d;
    }
    case 'all':
    default:
      return new Date(0);
  }
}

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Cette semaine',
  month: 'Ce mois',
  quarter: 'Ce trimestre',
  year: 'Cette année',
  all: 'Depuis toujours',
};

export function periodLabel(period: Period): string {
  return PERIOD_LABELS[period];
}

export function getTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

export function getTransactionsByPeriod(
  transactions: Transaction[],
  period: Period
): Transaction[] {
  const start = periodStart(period);
  return transactions
    .filter((t) => new Date(t.date) >= start)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFinancialSummary(
  transactions: Transaction[],
  accounts: Account[],
  period: Period
): FinancialSummary {
  const scoped = getTransactionsByPeriod(transactions, period);

  let income = 0;
  let expenses = 0;
  for (const t of scoped) {
    if (INCOME_CATEGORIES.includes(t.category)) {
      income += t.amount;
    } else {
      expenses += Math.abs(t.amount);
    }
  }

  const savingsRate = income > 0 ? (income - expenses) / income : 0;

  return {
    totalBalance: getTotalBalance(accounts),
    totalIncome: income,
    totalExpenses: expenses,
    savingsRate,
    periodLabel: PERIOD_LABELS[period],
  };
}

/**
 * Reconstructs a daily balance history for the period, ending at the current
 * total balance. Works backward from `today` applying transactions in reverse.
 */
export function getBalanceHistory(
  transactions: Transaction[],
  accounts: Account[],
  period: Period
): BalancePoint[] {
  const start = periodStart(period);
  const end = new Date();
  const totalBalance = getTotalBalance(accounts);

  // Build an array of day buckets from start → end (inclusive).
  const days: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const stopDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cursor <= stopDay) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // Net amount applied on each day.
  const deltaByDay = new Map<string, number>();
  for (const t of transactions) {
    const d = new Date(t.date);
    const key = d.toISOString().slice(0, 10);
    deltaByDay.set(key, (deltaByDay.get(key) ?? 0) + t.amount);
  }

  // Walk backwards from the end: balance[i-1] = balance[i] − delta[i]
  const points: BalancePoint[] = new Array(days.length);
  let running = totalBalance;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    points[i] = { date: day.toISOString(), balance: running };
    const key = day.toISOString().slice(0, 10);
    running -= deltaByDay.get(key) ?? 0;
  }

  return points;
}

/**
 * Aggregates spending by category over the given period.
 * Returns only expense categories, sorted by absolute total (desc).
 */
export function getCategoryBreakdown(
  transactions: Transaction[],
  period: Period
): CategoryBreakdown[] {
  const scoped = getTransactionsByPeriod(transactions, period).filter(
    (t) => !INCOME_CATEGORIES.includes(t.category)
  );

  const totals = new Map<TransactionCategory, { total: number; count: number }>();
  for (const t of scoped) {
    const amount = Math.abs(t.amount);
    const existing = totals.get(t.category);
    totals.set(t.category, {
      total: (existing?.total ?? 0) + amount,
      count: (existing?.count ?? 0) + 1,
    });
  }

  const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v.total, 0);
  if (grandTotal === 0) return [];

  return Array.from(totals.entries())
    .map(([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: total / grandTotal,
    }))
    .sort((a, b) => b.total - a.total);
}
