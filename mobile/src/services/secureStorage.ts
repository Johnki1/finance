import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'finance_auth_token';
const USER_KEY = 'finance_auth_user';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async saveUser(user: Record<string, unknown>): Promise<void> {
    const serialized = JSON.stringify(user);
    await SecureStore.setItemAsync(USER_KEY, serialized);
  },

  async getUser(): Promise<Record<string, unknown> | null> {
    const value = await SecureStore.getItemAsync(USER_KEY);
    if (value) return JSON.parse(value);
    return null;
  },

  async deleteUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
