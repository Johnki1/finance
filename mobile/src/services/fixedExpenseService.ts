import { httpClient } from '../api/httpClient';
import { offlineStore } from './offlineStore';

const CACHE_KEY = 'fixed_expenses';

export type FixedExpenseResponse = {
  id: number;
  description: string;
  amount: number;
  category: 'ARRIENDO' | 'AGUA' | 'LUZ' | 'GAS' | 'INTERNET_TV' | 'MASCOTAS' | 'MERCADO' | 'OTROS';
  dueDay: number | null;
  createdAt: string;
  updatedAt: string;
};

export type FixedExpenseRequest = {
  description: string;
  amount: number;
  category: 'ARRIENDO' | 'AGUA' | 'LUZ' | 'GAS' | 'INTERNET_TV' | 'MASCOTAS' | 'MERCADO' | 'OTROS';
  dueDay: number | null;
};

export const fixedExpenseService = {
  async list(): Promise<FixedExpenseResponse[]> {
    try {
      const { data } = await httpClient.get<FixedExpenseResponse[]>('/fixed-expenses');
      offlineStore.setCache(CACHE_KEY, data);
      return data;
    } catch (error) {
      const cached = await offlineStore.getCache<FixedExpenseResponse[]>(CACHE_KEY);
      if (cached?.data) return cached.data;
      throw error;
    }
  },

  async create(input: FixedExpenseRequest): Promise<FixedExpenseResponse> {
    try {
      const { data } = await httpClient.post<FixedExpenseResponse>('/fixed-expenses', input);
      return data;
    } catch (error) {
      await offlineStore.enqueue({ method: 'POST', url: '/fixed-expenses', payload: input });
      return {
        id: Date.now(),
        description: input.description,
        amount: input.amount,
        category: input.category,
        dueDay: input.dueDay,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: number, input: FixedExpenseRequest): Promise<FixedExpenseResponse> {
    try {
      const { data } = await httpClient.put<FixedExpenseResponse>(`/fixed-expenses/${id}`, input);
      return data;
    } catch (error) {
      await offlineStore.enqueue({ method: 'PUT', url: `/fixed-expenses/${id}`, payload: input });
      return {
        id,
        description: input.description,
        amount: input.amount,
        category: input.category,
        dueDay: input.dueDay,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await httpClient.delete(`/fixed-expenses/${id}`);
    } catch (error) {
      await offlineStore.enqueue({ method: 'DELETE', url: `/fixed-expenses/${id}` });
    }
  },
};
