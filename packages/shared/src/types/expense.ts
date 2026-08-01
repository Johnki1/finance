export type ExpenseCategory =
  | 'ARRIENDO'
  | 'AGUA'
  | 'LUZ'
  | 'GAS'
  | 'INTERNET_TV'
  | 'MASCOTAS'
  | 'MERCADO'
  | 'OTROS';

export interface FixedExpenseRequest {
  description: string;
  amount: number;
  category: ExpenseCategory;
  dueDay?: number | null;
}

export interface FixedExpenseResponse {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  dueDay: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface VariableExpenseRequest {
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export interface VariableExpenseResponse {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}