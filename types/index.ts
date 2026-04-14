/**
 * Core domain types for the finance app.
 */

export enum TransactionCategory {
  // Income
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  OTHER_INCOME = 'OTHER_INCOME',

  // Expense
  HOUSING = 'HOUSING',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  HEALTH = 'HEALTH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  TRAVEL = 'TRAVEL',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  /** Positive for income, negative for expense. */
  amount: number;
  label: string;
  category: TransactionCategory;
  /** ISO date string. */
  date: string;
  /** Account id. */
  account: string;
  note?: string;
  isRecurring?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  /** Ratio between 0 and 1. */
  savingsRate: number;
  periodLabel: string;
}

export type Period = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface BalancePoint {
  /** ISO date string. */
  date: string;
  balance: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  total: number;
  percentage: number;
  count: number;
}

/**
 * Category-level metadata: income vs. expense classification.
 */
export const INCOME_CATEGORIES: readonly TransactionCategory[] = [
  TransactionCategory.SALARY,
  TransactionCategory.FREELANCE,
  TransactionCategory.OTHER_INCOME,
] as const;

export const EXPENSE_CATEGORIES: readonly TransactionCategory[] = [
  TransactionCategory.HOUSING,
  TransactionCategory.FOOD,
  TransactionCategory.TRANSPORT,
  TransactionCategory.HEALTH,
  TransactionCategory.ENTERTAINMENT,
  TransactionCategory.SHOPPING,
  TransactionCategory.SUBSCRIPTIONS,
  TransactionCategory.TRAVEL,
  TransactionCategory.OTHER_EXPENSE,
] as const;
