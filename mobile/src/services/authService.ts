import { httpClient } from '../api/httpClient';
import { secureStorage } from './secureStorage';
import type { AuthRequest, AuthResponse } from '../types/auth';

const TOKEN_KEY = 'auth_token';

export type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  emailVerified: boolean;
  createdAt: string;
};

export const authService = {
  async login(request: AuthRequest): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', request);
    await secureStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async register(request: { email: string; password: string; firstName: string; lastName: string }): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/register', request);
    await secureStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async logout(): Promise<void> {
    await secureStorage.removeItem(TOKEN_KEY);
    await secureStorage.removeItem('finance_auth_user');
  },

  async getStoredToken(): Promise<string | null> {
    return secureStorage.getItem(TOKEN_KEY);
  },

  async me(): Promise<MeResponse> {
    const { data } = await httpClient.get<MeResponse>('/auth/me');
    return data;
  },

  async forgotPassword(email: string): Promise<void> {
    await httpClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await httpClient.post('/auth/reset-password', { token, newPassword });
  },
};
