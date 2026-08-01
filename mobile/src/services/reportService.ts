import { httpClient } from '../api/httpClient';

export type QuarterlyReportItem = {
  year: number;
  quarter: number;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  balance: number;
  accumulatedBalance: number;
};

export type ReportFilters = {
  mode: 'quarterly' | 'custom';
  year?: number;
  quarter?: number;
  startDate?: string;
  endDate?: string;
};

export const reportService = {
  async getQuarterly(year: number, quarter: number): Promise<QuarterlyReportItem[]> {
    const { data } = await httpClient.get<QuarterlyReportItem[]>('/reports/quarterly', {
      params: { year, quarter },
    });
    return data;
  },

  async getCustom(startDate: string, endDate: string): Promise<QuarterlyReportItem[]> {
    const { data } = await httpClient.get<QuarterlyReportItem[]>('/reports/custom', {
      params: { startDate, endDate },
    });
    return data;
  },
};