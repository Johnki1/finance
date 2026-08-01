export const EXPENSE_CATEGORIES = [
  'ARRIENDO',
  'AGUA',
  'LUZ',
  'GAS',
  'INTERNET_TV',
  'MASCOTAS',
  'MERCADO',
  'OTROS',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];