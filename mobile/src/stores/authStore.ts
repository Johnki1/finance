import { create } from 'zustand';
import { authService } from '../services/authService';

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  emailVerified: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({
        token: response.token,
        user: {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          roles: response.user.roles,
          emailVerified: response.user.emailVerified,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Credenciales inválidas';
      set({ error: message, isLoading: false, token: null, user: null, isAuthenticated: false });
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ email, password, firstName, lastName });
      set({
        token: response.token,
        user: {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          roles: response.user.roles,
          emailVerified: response.user.emailVerified,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No fue posible completar el registro';
      set({ error: message, isLoading: false, token: null, user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ token: null, user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
