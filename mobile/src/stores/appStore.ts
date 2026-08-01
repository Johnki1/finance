import { create } from 'zustand';

type AppState = {
  theme: 'light' | 'dark';
  language: string;
  setTheme: (theme: AppState['theme']) => void;
  setLanguage: (language: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'es',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));