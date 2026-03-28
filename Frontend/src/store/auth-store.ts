/**
 * Auth Store (Zustand)
 * Manages authentication state and user information
 */

import { create } from 'zustand';
import { User, AuthTokens } from '../types/index';
import { authApi } from '../api/auth-api';
import { storageUtils } from '../utils/storage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Auth Methods
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<User>;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setUser: (user: User | null) => set({ user }),
  setTokens: (tokens: AuthTokens | null) => set({ tokens }),
  setError: (error: string | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  register: async (email: string, name: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const tokens = await authApi.register({ email, name, password });
      await storageUtils.saveTokens(tokens);
      const user = await authApi.getMe();
      await storageUtils.saveUser(user);
      set({ tokens, user, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const tokens = await authApi.login({ email, password });
      await storageUtils.saveTokens(tokens);
      const user = await authApi.getMe();
      await storageUtils.saveUser(user);
      set({ tokens, user, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      await storageUtils.clearTokens();
      set({
        user: null,
        tokens: null,
        isLoading: false,
        error: null,
      });
    }
  },

  fetchCurrentUser: async () => {
    const user = await authApi.getMe();
    await storageUtils.saveUser(user);
    set({ user });
    return user;
  },

  initAuth: async () => {
    set({ isLoading: true });
    try {
      const tokens = await storageUtils.getTokens();
      const user = await storageUtils.getUser();

      console.log("tokens",tokens);
      console.log("user",user);
      
      
      if (tokens) {
        set({ tokens, user });

        if (!user) {
          try {
            const currentUser = await authApi.getMe();
            console.log("current User", currentUser);
            
            await storageUtils.saveUser(currentUser);
            set({ user: currentUser });
          } catch {
            await storageUtils.clearAll();
            set({ user: null, tokens: null });
          }
        }
      }
    } catch (error) {
      console.warn('Auth init error:', error);
      await storageUtils.clearAll();
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  clearError: () => set({ error: null }),
}));
