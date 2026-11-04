import * as SecureStore from 'expo-secure-store';

const sessionSlot = 'auth_token';
const profileSlot = 'finance_auth_user';

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
    await this.setItem(sessionSlot, token);
  },

  async getToken(): Promise<string | null> {
    return this.getItem(sessionSlot);
  },

  async deleteToken(): Promise<void> {
    await this.removeItem(sessionSlot);
  },

  async saveUser(user: Record<string, unknown>): Promise<void> {
    await this.setItem(profileSlot, JSON.stringify(user));
  },

  async getUser(): Promise<Record<string, unknown> | null> {
    const value = await this.getItem(profileSlot);
    if (!value) return null;
    return JSON.parse(value) as Record<string, unknown>;
  },

  async deleteUser(): Promise<void> {
    await this.removeItem(profileSlot);
  },
};
