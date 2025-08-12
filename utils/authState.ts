import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  password: string | null;
  isAppLocked: boolean;
  setupPin: (password: string) => Promise<boolean>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  setPassword: (password: string) => void;
  checkPassword: (password: string) => boolean;
}

export const useAuthState = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      password: null,
      isAppLocked: true, // App starts locked by default

      setupPin: async (inputPassword: string) => {
        const { password } = get();

        // Only allow setup if no password exists
        if (password) {
          return false; // Password already exists, use login instead
        }

        // First time setup - set the password
        set({
          password: inputPassword,
          isAuthenticated: true,
          isInitialized: true,
          isAppLocked: false,
        });
        return true;
      },

      login: async (inputPassword: string) => {
        const { password } = get();

        // Check if password exists
        if (!password) {
          return false; // No password set, use setupPin instead
        }

        // Check if password matches
        if (inputPassword === password) {
          set({ isAuthenticated: true, isInitialized: true, isAppLocked: false });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, isAppLocked: true });
      },

      lockApp: () => {
        set({ isAppLocked: true, isAuthenticated: false });
      },

      unlockApp: () => {
        set({ isAppLocked: false, isAuthenticated: true });
      },

      setPassword: (newPassword: string) => {
        set({ password: newPassword });
      },

      checkPassword: (inputPassword: string) => {
        const { password } = get();
        return password === inputPassword;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        password: state.password,
        isInitialized: state.isInitialized,
        isAppLocked: state.isAppLocked,
      }),
    }
  )
);
