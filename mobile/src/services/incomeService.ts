import { httpClient } from '../api/httpClient';
import { offlineStore } from './offlineStore';
import type { IncomeResponse, IncomeRequest } from '../../../packages/shared/src/types/income';

const CACHE_KEY = 'incomes';

export const incomeService = {
  async list(): Promise<IncomeResponse[]> {
    try {
      const { data } = await httpClient.get<IncomeResponse[]>('/incomes');
      offlineStore.setCache(CACHE_KEY, data);
      return data;
    } catch (error) {
      const cached = await offlineStore.getCache<IncomeResponse[]>(CACHE_KEY);
      if (cached?.data) return cached.data;
      throw error;
    }
  },

  async create(input: IncomeRequest): Promise<IncomeResponse> {
    try {
      const { data } = await httpClient.post<IncomeResponse>('/incomes', input);
      return data;
    } catch (error) {
      await offlineStore.enqueue({ method: 'POST', url: '/incomes', payload: input });
      return {
        id: Date.now(),
        description: input.description,
        amount: input.amount,
        date: input.date,
        category: input.category ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
};
