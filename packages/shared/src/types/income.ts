export interface IncomeRequest {
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export interface IncomeResponse {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}