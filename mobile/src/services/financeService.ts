import { httpClient } from '../api/httpClient';
import type { FinanceSummaryResponse } from '../../../packages/shared/src/types/common';

export const financeService = {
  async getSummary(): Promise<FinanceSummaryResponse> {
    const { data } = await httpClient.get<FinanceSummaryResponse>('/summary');
    return data;
  },
};