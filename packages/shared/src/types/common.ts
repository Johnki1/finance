export interface FinanceSummaryResponse {
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  balance: number;
  accumulatedBalance: number;
}

export interface QuarterlyReportResponse {
  year: number;
  quarter: number;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  balance: number;
  accumulatedBalance: number;
}