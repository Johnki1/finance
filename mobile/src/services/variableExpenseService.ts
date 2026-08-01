import { httpClient } from '../api/httpClient';
import { offlineStore } from './offlineStore';

const CACHE_KEY = 'variable_expenses';

export type VariableExpenseResponse = {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VariableExpenseRequest = {
  description: string;
  amount: number;
  date: string;
  category?: string | null;
};

export const variableExpenseService = {
  async list(): Promise<VariableExpenseResponse[]> {
    try {
      const { data } = await httpClient.get<VariableExpenseResponse[]>('/variable-expenses');
      offlineStore.setCache(CACHE_KEY, data);
      return data;
    } catch (error) {
      const cached = await offlineStore.getCache<VariableExpenseResponse[]>(CACHE_KEY);
      if (cached?.data) return cached.data;
      throw error;
    }
  },

  async create(input: VariableExpenseRequest): Promise<VariableExpenseResponse> {
    try {
      const { data } = await httpClient.post<VariableExpenseResponse>('/variable-expenses', input);
      return data;
    } catch (error) {
      await offlineStore.enqueue({ method: 'POST', url: '/variable-expenses', payload: input });
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

  async update(id: number, input: VariableExpenseRequest): Promise<VariableExpenseResponse> {
    try {
      const { data } = await httpClient.put<VariableExpenseResponse>(`/variable-expenses/${id}`, input);
      return data;
    } catch (error) {
      await offlineStore.enqueue({ method: 'PUT', url: `/variable-expenses/${id}`, payload: input });
      return {
        id,
        description: input.description,
        amount: input.amount,
        date: input.date,
        category: input.category ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await httpClient.delete(`/variable-expenses/${id}`);
    } catch (error) {
      await offlineStore.enqueue({ method: 'DELETE', url: `/variable-expenses/${id}` });
    }
  },
};